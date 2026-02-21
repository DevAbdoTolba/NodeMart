import { readFileSync } from 'fs';

// 1 = customer, 2 = guest, 4 = admin
const mask = parseInt(process.argv[2]) || 0;
const fail = process.argv.includes('==fail');
const type = fail ? 'fail' : 'pass';

if (!mask) {
    console.log('Usage: npm run test -- <1|2|3|4|6|7> [==fail]');
    process.exit(0);
}

// Parse a .hurl file into a list of requests
function parseHurl(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const requests = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        // Look for HTTP method
        const methodMatch = line.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(http.+)$/);
        if (!methodMatch) { i++; continue; }

        const req = { method: methodMatch[1], url: methodMatch[2], headers: {}, body: null, expectedStatus: 200, captures: {} };
        i++;

        // Read headers
        while (i < lines.length) {
            const h = lines[i].trim();
            if (!h || h.startsWith('{') || h.startsWith('HTTP') || h.startsWith('#') || h.startsWith('[')) break;
            const colonIdx = h.indexOf(':');
            if (colonIdx > 0) {
                req.headers[h.slice(0, colonIdx).trim()] = h.slice(colonIdx + 1).trim();
            }
            i++;
        }

        // Read JSON body
        if (i < lines.length && lines[i].trim().startsWith('{')) {
            let jsonStr = '';
            while (i < lines.length) {
                jsonStr += lines[i].trim();
                if (lines[i].trim() === '}') { i++; break; }
                i++;
            }
            req.body = jsonStr;
        }

        // Read expected HTTP status
        while (i < lines.length) {
            const h = lines[i].trim();
            if (h.match(/^HTTP\s+\d+/)) {
                req.expectedStatus = parseInt(h.split(/\s+/)[1]);
                i++;
                break;
            }
            if (h.match(/^(GET|POST|PUT|PATCH|DELETE)\s+/)) break;
            i++;
        }

        // Read [Captures]
        if (i < lines.length && lines[i].trim() === '[Captures]') {
            i++;
            while (i < lines.length) {
                const c = lines[i].trim();
                if (!c || c.startsWith('#') || c.startsWith('[') || c.match(/^(GET|POST|PUT|PATCH|DELETE)\s+/)) break;
                const capMatch = c.match(/^(\w+):\s*jsonpath\s+"([^"]+)"/);
                if (capMatch) {
                    req.captures[capMatch[1]] = capMatch[2];
                }
                i++;
            }
        }

        requests.push(req);
    }
    return requests;
}

// Resolve jsonpath like "$.token" or "$.data.data._id"
function jsonpath(obj, path) {
    const parts = path.replace('$.', '').split('.');
    let val = obj;
    for (const p of parts) {
        if (val == null) return undefined;
        val = val[p];
    }
    return val;
}

// Replace {{variable}} in strings
function replaceVars(str, vars) {
    return str.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] || '');
}

async function runFile(filePath) {
    const requests = parseHurl(filePath);
    const vars = { unix_timestamp: Date.now().toString() };
    let passed = 0;
    let failed = 0;

    console.log(`\n  Running: ${filePath} (${requests.length} requests)\n`);

    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        const url = replaceVars(req.url, vars);
        const headers = {};
        for (const [k, v] of Object.entries(req.headers)) {
            headers[k] = replaceVars(v, vars);
        }
        const body = req.body ? replaceVars(req.body, vars) : null;

        if (body && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const res = await fetch(url, {
                method: req.method,
                headers,
                body
            });

            const status = res.status;
            let data = null;
            try { data = await res.json(); } catch {}

            if (status === req.expectedStatus) {
                console.log(`  ✅ ${req.method} ${url} → ${status}`);
                passed++;
            } else {
                console.log(`  ❌ ${req.method} ${url} → ${status} (expected ${req.expectedStatus})`);
                if (data) console.log(`     Response: ${JSON.stringify(data).slice(0, 200)}`);
                failed++;
            }

            // Process captures
            if (data) {
                for (const [varName, path] of Object.entries(req.captures)) {
                    vars[varName] = jsonpath(data, path);
                }
            }
        } catch (err) {
            console.log(`  ❌ ${req.method} ${url} → ${err.message}`);
            failed++;
        }
    }

    console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
    return failed === 0;
}

// Run selected flows
let allPassed = true;
if (mask & 1) allPassed = await runFile(`src/test/flow/${type}/customer-flow.hurl`) && allPassed;
if (mask & 2) allPassed = await runFile(`src/test/flow/${type}/guest-flow.hurl`) && allPassed;
if (mask & 4) allPassed = await runFile(`src/test/flow/${type}/admin-flow.hurl`) && allPassed;

if (!allPassed) process.exit(1);
