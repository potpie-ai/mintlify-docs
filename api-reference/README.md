# Potpie API Reference Documentation

Welcome to the Potpie API documentation. This directory contains comprehensive documentation for all Potpie API endpoints, including detailed examples, schemas, and integration guides.

## 📚 Documentation Files

### Core Documentation
- **`openapi.json`** - Complete OpenAPI 3.1 specification for the Potpie API
- **`introduction.mdx`** - Getting started guide with complete integration examples

### Endpoint Documentation

#### Parsing & Projects
1. **`endpoint/parse-directory.mdx`** - POST `/api/v1/parse`
   - Initiate codebase parsing
   - Build knowledge graph

2. **`endpoint/get-parsing-status.mdx`** - GET `/api/v1/parsing-status/{project_id}`
   - Monitor parsing progress
   - Real-time status updates

3. **`endpoint/list-projects.mdx`** - GET `/api/v1/projects/list`
   - List all parsed projects
   - Project metadata and status

4. **`endpoint/search-codebase.mdx`** - POST `/api/v1/search`
   - Semantic code search
   - Natural language queries

#### Conversations & Agents
5. **`endpoint/create-conversation.mdx`** - POST `/api/v1/conversations/`
   - Start AI agent conversations
   - Multi-agent support

6. **`endpoint/post-message.mdx`** - POST `/api/v1/conversations/{conversation_id}/message/`
   - Send messages to AI agents
   - Context-aware interactions

7. **`endpoint/list-agents.mdx`** - GET `/api/v1/list-available-agents/`
   - List available AI agents
   - Agent capabilities and specializations

## 🚀 Quick Start

### 1. Get Your API Key
Get your API key from the [Potpie Dashboard](https://app.potpie.ai/settings/api-keys).

### 2. Make Your First Request

```bash
curl -X GET \
  'https://production-api.potpie.ai/api/v1/projects/list' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

### 3. Complete Integration

See `introduction.mdx` for complete TypeScript and Python integration examples.

## 📖 Documentation Features

### Code Examples
Every endpoint includes examples in:
- **cURL** - For quick testing
- **TypeScript** - With full type definitions
- **Python** - With type hints
- **JavaScript** - Node.js examples

### Complete Workflows
- Repository parsing workflow
- Conversation creation flow
- Search and discovery patterns
- Error handling strategies

### Best Practices
- Authentication security
- Rate limit handling
- Error handling patterns
- Performance optimization
- Polling strategies

## 🔑 Authentication

All API endpoints require Bearer token authentication:

```bash
Authorization: Bearer YOUR_API_KEY
```

Store your API key securely:
- Use environment variables
- Never commit to version control
- Rotate keys periodically

## 📊 Rate Limits

| Resource | Limit |
|----------|-------|
| API Requests | 1000/hour |
| Parsing Jobs | 5 concurrent |
| Messages | 10/min per conversation |
| Searches | 100/min |

## 🔄 Typical Workflow

```
1. Parse Repository (POST /api/v1/parse)
   ↓
2. Check Status (GET /api/v1/parsing-status/:id)
   ↓ (poll until complete)
3. List Projects (GET /api/v1/projects/list)
   ↓
4. List Agents (GET /api/v1/list-available-agents/)
   ↓
5. Create Conversation (POST /api/v1/conversations/)
   ↓
6. Search Codebase (POST /api/v1/search) [optional]
   ↓
7. Post Messages (POST /api/v1/conversations/:id/message/)
   ↓
8. Continue conversation or start new analysis
```

## 🛠️ Using the OpenAPI Spec

The `openapi.json` file can be used with:

### API Testing Tools
- **Postman**: Import the OpenAPI spec for instant collection
- **Insomnia**: Load spec for request templates
- **Swagger UI**: Interactive API documentation
- **Stoplight**: API design and testing

### Code Generation
```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./generated-client

# Generate Python client
openapi-generator generate \
  -i openapi.json \
  -g python \
  -o ./python-client
```

### API Validation
```bash
# Validate OpenAPI spec
npx @openapitools/openapi-generator-cli validate -i openapi.json
```

## 📝 Example Integration

### TypeScript
```typescript
import fetch from 'node-fetch';

class PotpieClient {
  constructor(private apiKey: string) {}

  async parseRepo(repoName: string, branch: string) {
    const response = await fetch(
      'https://production-api.potpie.ai/api/v1/parse',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repo_name: repoName,
          branch_name: branch
        })
      }
    );
    return response.json();
  }
}

// Usage
const client = new PotpieClient(process.env.POTPIE_API_KEY!);
const result = await client.parseRepo('owner/repo', 'main');
```

### Python
```python
import requests
import os

class PotpieClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://production-api.potpie.ai'

    def parse_repo(self, repo_name: str, branch: str):
        response = requests.post(
            f'{self.base_url}/api/v1/parse',
            headers={
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'repo_name': repo_name,
                'branch_name': branch
            }
        )
        return response.json()

# Usage
client = PotpieClient(os.environ['POTPIE_API_KEY'])
result = client.parse_repo('owner/repo', 'main')
```

## 🔍 Finding Information

### By Task
- **Parse codebase**: `parse-directory.mdx`
- **Monitor progress**: `get-parsing-status.mdx`
- **Ask questions**: `create-conversation.mdx` + `post-message.mdx`
- **Find code**: `search-codebase.mdx`
- **List resources**: `list-projects.mdx` + `list-agents.mdx`

### By HTTP Method
- **GET**: Status, lists, and retrieval
  - Get Parsing Status
  - List Projects
  - List Agents

- **POST**: Creation and actions
  - Parse Directory
  - Create Conversation
  - Post Message
  - Search Codebase

## ⚠️ Error Handling

All endpoints may return these HTTP status codes:

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify API key |
| 404 | Not Found | Check resource ID |
| 422 | Validation Error | Fix request body |
| 429 | Rate Limit | Wait and retry |
| 500 | Server Error | Contact support |

### Error Response Format
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## 🎯 Best Practices

### 1. Authentication
```typescript
// ✅ Good - Use environment variables
const apiKey = process.env.POTPIE_API_KEY;

// ❌ Bad - Hardcoded keys
const apiKey = 'your-key-here';
```

### 2. Error Handling
```typescript
// ✅ Good - Handle all error cases
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error('API error:', error);
  throw error;
}

// ❌ Bad - No error handling
const response = await fetch(url, options);
return response.json();
```

### 3. Polling
```typescript
// ✅ Good - Exponential backoff
let delay = 2000;
while (true) {
  const status = await checkStatus();
  if (status.complete) break;
  await sleep(delay);
  delay = Math.min(delay * 1.5, 30000);
}

// ❌ Bad - Fixed rapid polling
while (true) {
  const status = await checkStatus();
  if (status.complete) break;
  await sleep(1000); // Too frequent
}
```

### 4. Rate Limits
```typescript
// ✅ Good - Implement retry with backoff
async function apiCall() {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error.status === 429) {
      await sleep(5000);
      return apiCall(); // Retry
    }
    throw error;
  }
}

// ❌ Bad - No retry logic
const response = await fetch(url, options);
```

## 📦 Related Resources

### Official Resources
- **Main Documentation**: https://docs.potpie.ai
- **Dashboard**: https://app.potpie.ai
- **GitHub**: https://github.com/potpie-ai/potpie

### Community
- **Discord**: https://discord.gg/ryk5CMD5v6
- **GitHub Issues**: https://github.com/potpie-ai/potpie/issues

### Support
- **Email**: hi@potpie.ai
- **Documentation Issues**: Report on GitHub

## 🔄 API Versioning

Current API version: **v1**

All endpoints are prefixed with `/api/v1/`

When breaking changes are introduced, a new version will be released (v2, v3, etc.) with:
- 6-month deprecation notice for old versions
- Migration guide documentation
- Changelog with breaking changes highlighted

## 🧪 Testing

### Postman Collection
Import `openapi.json` into Postman to get a complete collection with:
- All endpoints configured
- Example requests
- Environment variables template

### Local Development
```bash
# Set up environment
export POTPIE_API_KEY="your-key-here"
export POTPIE_API_URL="https://production-api.potpie.ai"

# Test endpoints
curl -X GET \
  "$POTPIE_API_URL/api/v1/projects/list" \
  -H "Authorization: Bearer $POTPIE_API_KEY"
```

## 📈 API Status

Check the API status at: https://status.potpie.ai (coming soon)

Current status: ✅ **All systems operational**

## 🆘 Getting Help

1. **Check Documentation**: Start with `introduction.mdx`
2. **Review Examples**: Look at endpoint-specific examples
3. **Search Issues**: Check GitHub for similar questions
4. **Ask Community**: Join Discord for community support
5. **Contact Support**: Email hi@potpie.ai for direct help

## 📝 Contributing

Found an issue in the documentation?

1. Open an issue on GitHub
2. Submit a pull request with fixes
3. Join Discord to discuss improvements

## ⚖️ License

This documentation is part of the Potpie project. See main repository for license information.

---

**Last Updated**: February 9, 2026
**API Version**: v1
**Documentation Version**: 1.0.0
