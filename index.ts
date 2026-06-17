import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import matter from "gray-matter";
import { globSync } from "glob";
import * as path from "path";
import * as fs from "fs";
import express from "express";

// กำหนด Path ไปยังโฟลเดอร์ที่เก็บ OKF Bundle
const OKF_BUNDLE_DIR = path.resolve(process.cwd(), "okf_data");

// --- Core Logic (Shared between MCP and REST) ---

const listNodes = () => {
    const mdFiles = globSync("**/*.md", { cwd: OKF_BUNDLE_DIR });
    const fileList = mdFiles.map(file => file.replace(/\\/g, "/"));

    return fileList.map(file => {
        const filePath = path.join(OKF_BUNDLE_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        // Regex สำหรับหา Markdown Links: [text](path/to/file.md)
        const linkRegex = /\[(?:[^\]]+)\]\(([^)]+\.md)\)/g;
        const foundLinks: string[] = [];
        const brokenLinks: string[] = [];
        
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            let targetPath = match[1];
            // Resolve relative path
            const absoluteTarget = path.posix.join(path.dirname(file), targetPath).replace(/\\/g, "/");
            
            if (fileList.includes(absoluteTarget)) {
                foundLinks.push(absoluteTarget);
            } else {
                brokenLinks.push(absoluteTarget);
            }
        }

        return {
            filename: file,
            title: data.title || file,
            description: data.description || "No description",
            type: data.type || "concept",
            tags: data.tags || [],
            timestamp: data.timestamp || fs.statSync(filePath).mtime.toISOString(),
            links: foundLinks,
            brokenLinks: brokenLinks
        };
    });
};

const getNodeContent = (filename: string) => {
    const filePath = path.join(OKF_BUNDLE_DIR, filename);
    if (!filePath.startsWith(OKF_BUNDLE_DIR) || !fs.existsSync(filePath)) {
        return null;
    }
    return fs.readFileSync(filePath, "utf-8");
};

const searchNodes = (query: string = "", tag: string = "") => {
    const q = query.toLowerCase();
    const t = tag.toLowerCase();
    const nodes = listNodes();
    
    return nodes.filter(node => {
        const title = (node.title || "").toLowerCase();
        const description = (node.description || "").toLowerCase();
        const tags = (node.tags || []).map((v: any) => String(v).toLowerCase());

        let match = false;
        if (t && tags.includes(t)) match = true;
        if (q && (title.includes(q) || description.includes(q))) match = true;
        if (!q && !t) match = true;

        return match;
    });
};

// --- MCP Server Setup ---

const server = new Server({
    name: "okf-mcp-server",
    version: "1.2.0",
}, {
    capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "list_okf_nodes",
            description: "List all available concepts and pages in the OKF bundle.",
            inputSchema: { type: "object", properties: {} }
        },
        {
            name: "get_okf_content",
            description: "Get the full markdown content of a specific OKF file.",
            inputSchema: {
                type: "object",
                properties: {
                    filename: { type: "string", description: "The filename (e.g., 'projects/project.md')" }
                },
                required: ["filename"]
            }
        },
        {
            name: "search_okf_nodes",
            description: "Search for OKF nodes by keyword or tag.",
            inputSchema: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Search keyword" },
                    tag: { type: "string", description: "Filter by tag" }
                }
            }
        }
    ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case "list_okf_nodes":
            return { content: [{ type: "text", text: JSON.stringify(listNodes(), null, 2) }] };
        case "get_okf_content":
            const content = getNodeContent(String(args?.filename));
            if (!content) return { content: [{ type: "text", text: "Error: File not found" }], isError: true };
            return { content: [{ type: "text", text: content }] };
        case "search_okf_nodes":
            const results = searchNodes(String(args?.query || ""), String(args?.tag || ""));
            return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});

// --- REST API Setup ---

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/nodes", (req, res) => {
    res.json(listNodes());
});

app.get("/api/graph", (req, res) => {
    const nodes = listNodes();
    const graphNodes: any[] = [];
    const graphLinks: any[] = [];
    const tagMap = new Map<string, string[]>();

    nodes.forEach(node => {
        graphNodes.push({ id: node.filename, title: node.title, type: node.type });
        
        node.tags.forEach((tag: string) => {
            if (!tagMap.has(tag)) {
                tagMap.set(tag, []);
                graphNodes.push({ id: `tag:${tag}`, title: tag, type: "tag" });
            }
            tagMap.get(tag)?.push(node.filename);
            graphLinks.push({ source: node.filename, target: `tag:${tag}`, linkType: "tag" });
        });

        node.links?.forEach(target => {
            graphLinks.push({ source: node.filename, target: target, linkType: "reference" });
        });

        node.brokenLinks?.forEach(target => {
            const brokenId = `broken:${target}`;
            if (!graphNodes.find(n => n.id === brokenId)) {
                graphNodes.push({ id: brokenId, title: `MISSING: ${target}`, type: "broken" });
            }
            graphLinks.push({ source: node.filename, target: brokenId, linkType: "broken" });
        });
    });

    res.json({ nodes: graphNodes, links: graphLinks });
});

app.get("/api/search", (req, res) => {
    const { q, tag } = req.query;
    res.json(searchNodes(String(q || ""), String(tag || "")));
});

app.use("/api/nodes/", (req, res) => {
    const filename = decodeURIComponent(req.path.replace(/^\//, ""));
    const content = getNodeContent(filename || "");
    if (!content) return res.status(404).json({ error: "File not found" });
    const parsed = matter(content);
    res.json({ metadata: parsed.data, content: parsed.content });
});

// --- Start Server ---

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("OKF MCP Server is running on stdio");
    app.listen(PORT, () => {
        console.error(`Dashboard & REST API is running on http://localhost:${PORT}`);
    });
}

main().catch(console.error);