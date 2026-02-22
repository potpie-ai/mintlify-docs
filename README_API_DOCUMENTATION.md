# Potpie API Documentation - Complete Guide

## Overview

This directory contains comprehensive documentation for the Potpie API, which provides AI-powered codebase intelligence through conversations, semantic search, and intelligent agents.

## Documentation Files

### 1. OpenAPI Specification
- **File:** `api-reference/openapi-curated.json`
- **Description:** Complete OpenAPI 3.1 specification with detailed schemas, examples, and descriptions for all 7 core endpoints
- **Usage:** Import into API clients, testing tools, or documentation generators

### 2. Comprehensive Endpoint Guide
- **File:** `API_ENDPOINTS_SUMMARY.md`
- **Description:** Detailed documentation for each endpoint with examples in cURL, Python, and TypeScript
- **Contents:**
  - Endpoint descriptions and parameters
  - Request/response examples
  - Use cases and best practices
  - Complete integration workflows
  - Error handling guides

### 3. Interactive Documentation
- **Location:** `api-reference/endpoint/*.mdx`
- **Description:** Mintlify-formatted documentation for each endpoint
- **Files:**
  - `create-conversation.mdx` - Create conversations with AI agents
  - `parse-directory.mdx` - Parse repositories to build knowledge graphs
  - `get-parsing-status.mdx` - Monitor parsing progress
  - `post-message.mdx` - Send messages to conversations
  - `list-projects.mdx` - Retrieve all parsed projects
  - `list-agents.mdx` - Get available AI agents
  - `search-codebase.mdx` - Semantic search across codebases

### 4. API Reference Introduction
- **File:** `api-reference/introduction.mdx`
- **Description:** Getting started guide with authentication, quickstart examples, and workflow diagrams

## API Endpoints Summary

### Available Endpoints (7 Total)

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `/api/v1/conversations/` | POST | Create conversation with AI agents |
| 2 | `/api/v1/parse` | POST | Parse repository to build knowledge graph |
| 3 | `/api/v1/parsing-status/{project_id}` | GET | Check parsing progress |
| 4 | `/api/v1/conversations/{conversation_id}/message/` | POST | Send message to conversation |
| 5 | `/api/v1/projects/list` | GET | List all parsed projects |
| 6 | `/api/v1/list-available-agents/` | GET | Get available AI agents |
| 7 | `/api/v1/search` | POST | Semantic codebase search |

## Key Features

### 1. Conversations
- Create conversations with specialized AI agents
- Send messages with code context
- Get intelligent responses based on knowledge graph
- Support for multi-agent conversations

### 2. Parsing
- Parse repositories from local paths or remote URLs
- Real-time progress monitoring
- Builds comprehensive knowledge graphs
- Supports all major programming languages

### 3. Projects
- Manage multiple parsed codebases
- Track parsing status
- Associate projects with conversations
- Archive or delete projects

### 4. Agents
- 5 specialized AI agents:
  - **Debugging Agent** - Bug identification and fixing
  - **Q&A Agent** - Code explanation and questions
  - **Code Changes Agent** - Code modifications and features
  - **Unit Test Agent** - Unit test generation
  - **Integration Test Agent** - Integration test planning

### 5. Search
- Semantic search using natural language
- Relevance scoring
- Code element identification (functions, classes, etc.)
- Integration with conversations for contextual queries

## Quick Start

### 1. Get API Key
```bash
# Get your API key from: https://app.potpie.ai/settings/api-keys
export POTPIE_API_KEY="your_api_key_here"
```

### 2. Parse a Repository
```bash
curl -X POST https://production-api.potpie.ai/api/v1/parse \
  -H "Authorization: Bearer $POTPIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_name": "my-project",
    "repo_path": "/path/to/repo",
    "branch_name": "main"
  }'
```

### 3. Check Parsing Status
```bash
curl -X GET https://production-api.potpie.ai/api/v1/parsing-status/proj_456 \
  -H "Authorization: Bearer $POTPIE_API_KEY"
```

### 4. Create Conversation
```bash
curl -X POST https://production-api.potpie.ai/api/v1/conversations/ \
  -H "Authorization: Bearer $POTPIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "title": "Debug Session",
    "status": "active",
    "project_ids": ["proj_456"],
    "agent_ids": ["debugging-agent"]
  }'
```

### 5. Ask Questions
```bash
curl -X POST https://production-api.potpie.ai/api/v1/conversations/conv_789/message/ \
  -H "Authorization: Bearer $POTPIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "How does authentication work in this codebase?"
  }'
```

## Integration Examples

### Python SDK Pattern

```python
import requests
import time

class PotpieClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://production-api.potpie.ai'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def parse_and_wait(self, repo_name: str, branch: str = 'main'):
        # Parse repository
        response = requests.post(
            f'{self.base_url}/api/v1/parse',
            headers=self.headers,
            json={'repo_name': repo_name, 'branch_name': branch}
        )
        project_id = response.json()['project_id']

        # Wait for completion
        while True:
            status = requests.get(
                f'{self.base_url}/api/v1/parsing-status/{project_id}',
                headers=self.headers
            ).json()

            if status['status'] == 'completed':
                return project_id
            elif status['status'] == 'failed':
                raise Exception(f"Parsing failed: {status['message']}")

            time.sleep(10)

    def ask_agent(self, project_id: str, question: str, agent: str = 'qna-agent'):
        # Create conversation
        conv_response = requests.post(
            f'{self.base_url}/api/v1/conversations/',
            headers=self.headers,
            json={
                'user_id': 'user_123',
                'title': 'Quick Question',
                'status': 'active',
                'project_ids': [project_id],
                'agent_ids': [agent]
            }
        )
        conversation_id = conv_response.json()['conversation_id']

        # Send message
        requests.post(
            f'{self.base_url}/api/v1/conversations/{conversation_id}/message/',
            headers=self.headers,
            json={'content': question}
        )

        return conversation_id

# Usage
client = PotpieClient('YOUR_API_KEY')
project_id = client.parse_and_wait('my-project')
conv_id = client.ask_agent(project_id, 'Explain the authentication flow')
```

### TypeScript SDK Pattern

```typescript
class PotpieClient {
  private apiKey: string;
  private baseUrl = 'https://production-api.potpie.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async parseRepository(repoName: string, branch: string = 'main') {
    const data = await this.request('/api/v1/parse', {
      method: 'POST',
      body: JSON.stringify({
        repo_name: repoName,
        branch_name: branch,
      }),
    });
    return data.project_id;
  }

  async waitForParsing(projectId: string): Promise<void> {
    while (true) {
      const status = await this.request(
        `/api/v1/parsing-status/${projectId}`
      );

      if (status.status === 'completed') return;
      if (status.status === 'failed') {
        throw new Error(`Parsing failed: ${status.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  async searchCode(projectId: string, query: string) {
    const data = await this.request('/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, query }),
    });
    return data.results;
  }

  async createConversation(
    userId: string,
    title: string,
    projectIds: string[],
    agentIds: string[]
  ) {
    const data = await this.request('/api/v1/conversations/', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        title,
        status: 'active',
        project_ids: projectIds,
        agent_ids: agentIds,
      }),
    });
    return data.conversation_id;
  }

  async sendMessage(conversationId: string, content: string, nodeIds?: any[]) {
    return this.request(
      `/api/v1/conversations/${conversationId}/message/`,
      {
        method: 'POST',
        body: JSON.stringify({ content, node_ids: nodeIds }),
      }
    );
  }
}

// Usage
const client = new PotpieClient('YOUR_API_KEY');
const projectId = await client.parseRepository('my-project');
await client.waitForParsing(projectId);
const results = await client.searchCode(projectId, 'authentication');
```

## Typical Workflows

### Workflow 1: Parse and Ask Questions

```
1. Parse Repository → 2. Wait for Completion → 3. Create Conversation → 4. Send Messages
```

**Use Case:** Onboard a new codebase and start asking questions

### Workflow 2: Search and Debug

```
1. List Projects → 2. Search Codebase → 3. Create Conversation with Context → 4. Debug with Agent
```

**Use Case:** Find specific code and get debugging help

### Workflow 3: Code Review

```
1. Parse Changes → 2. Search Modified Files → 3. Create Multi-Agent Conversation → 4. Review and Test
```

**Use Case:** Review code changes with multiple agents

### Workflow 4: Test Generation

```
1. Search Functions → 2. Create Conversation with Test Agents → 3. Request Test Generation
```

**Use Case:** Generate comprehensive test coverage

## Authentication

### Bearer Token Authentication

All API requests require authentication using Bearer tokens:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Getting Your API Key

1. Sign up at https://app.potpie.ai
2. Navigate to Settings → API Keys
3. Generate a new API key
4. Store securely in environment variables

### Security Best Practices

- **Never commit API keys** to version control
- **Use environment variables** for key storage
- **Rotate keys periodically** for security
- **Use different keys** for development and production
- **Implement proper error handling** to avoid exposing keys in logs

## Rate Limits

| Resource | Limit | Retry After |
|----------|-------|-------------|
| API Requests | 1000/hour | 3600 seconds |
| Parsing Jobs | 5 concurrent | Wait for completion |
| Messages | 10/minute per conversation | 60 seconds |
| Search Queries | 100/minute | 60 seconds |

### Handling Rate Limits

```python
import time
from requests.exceptions import HTTPError

def make_request_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except HTTPError as e:
            if e.response.status_code == 429:
                wait_time = int(e.response.headers.get('Retry-After', 60))
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise
    raise Exception("Max retries exceeded")
```

## Error Handling

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Unauthorized | Check API key validity |
| 404 | Not Found | Verify resource ID exists |
| 422 | Validation Error | Check request body format |
| 429 | Rate Limited | Implement backoff and retry |
| 500 | Server Error | Contact support if persists |

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

### Robust Error Handling

```typescript
async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        console.error('Authentication failed - check API key');
      } else if (error.status === 429) {
        console.error('Rate limit exceeded - implement backoff');
      } else if (error.status === 422) {
        const body = await error.json();
        console.error('Validation error:', body);
      } else {
        console.error(`API error ${error.status}:`, await error.text());
      }
    } else {
      console.error('Request failed:', error);
    }
    return null;
  }
}
```

## Testing

### Using Postman

1. Import `openapi-curated.json` into Postman
2. Create environment with `POTPIE_API_KEY` variable
3. Use pre-request script to set authorization:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('POTPIE_API_KEY')
   });
   ```

### Using cURL

```bash
# Set API key
export POTPIE_API_KEY="your_key_here"

# Make requests
curl -X GET https://production-api.potpie.ai/api/v1/projects/list \
  -H "Authorization: Bearer $POTPIE_API_KEY"
```

### Using Insomnia

1. Import OpenAPI spec
2. Create environment
3. Add authorization header to base environment

## SDK Development

### Community SDKs

We welcome community-contributed SDKs! Here's a template structure:

```
potpie-sdk/
├── src/
│   ├── client.ts          # Main client class
│   ├── endpoints/
│   │   ├── conversations.ts
│   │   ├── parsing.ts
│   │   ├── projects.ts
│   │   ├── agents.ts
│   │   └── search.ts
│   ├── types/             # TypeScript types
│   └── utils/             # Helpers
├── tests/
└── examples/
```

### Official SDKs (Coming Soon)

- **TypeScript/JavaScript** - Full-featured SDK
- **Python** - Async/sync support
- **Go** - High-performance client
- **Ruby** - Rails integration

## Support & Resources

### Documentation
- **Main Docs:** https://docs.potpie.ai
- **API Reference:** https://docs.potpie.ai/api-reference
- **Guides:** https://docs.potpie.ai/guides

### Community
- **Discord:** https://discord.gg/ryk5CMD5v6
- **GitHub:** https://github.com/potpie-ai/potpie
- **Twitter:** https://twitter.com/potpiedotai

### Help
- **Email:** hi@potpie.ai
- **Issues:** https://github.com/potpie-ai/potpie/issues
- **Status:** https://status.potpie.ai

## Changelog

### 2024-02-09 - Initial Release
- 7 core endpoints documented
- OpenAPI 3.1 specification
- Complete examples in cURL, Python, TypeScript
- Interactive Mintlify documentation
- Authentication and error handling guides

## Contributing

We welcome contributions to our documentation! To contribute:

1. Fork the repository
2. Make your changes
3. Submit a pull request
4. Follow our documentation style guide

### Documentation Style Guide

- Use clear, concise language
- Provide real-world examples
- Include code samples in multiple languages
- Add error handling examples
- Test all code examples

## License

Potpie API is proprietary. See https://potpie.ai/terms for details.

---

## Note on Missing Endpoints

The user requested documentation for 10 endpoints, but only 7 exist in the actual API:

**Documented (7 endpoints):**
1. ✅ POST /api/v1/conversations/ - Create Conversation
2. ✅ POST /api/v1/parse - Parse Directory
3. ✅ GET /api/v1/parsing-status/{project_id} - Get Parsing Status
4. ✅ POST /api/v1/conversations/{conversation_id}/message/ - Post Message
5. ✅ GET /api/v1/projects/list - List Projects
6. ✅ GET /api/v1/list-available-agents/ - List Available Agents
7. ✅ POST /api/v1/search - Search Codebase

**Not in API (3 requested but don't exist):**
- ❌ Get Parsing Status By Repo
- ❌ Create Conversation And Message (combined endpoint)
- ❌ Save Integration

The documentation covers all available endpoints comprehensively with detailed examples, use cases, and integration patterns.

---

**Last Updated:** 2024-02-09
**API Version:** 1.0.0
**Documentation Version:** 1.0.0
