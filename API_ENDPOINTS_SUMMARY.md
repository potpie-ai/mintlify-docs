# Potpie API - Complete Endpoint Documentation

## Overview

This document provides comprehensive documentation for the 7 core Potpie API endpoints. The API enables AI-powered codebase intelligence through conversations, semantic search, and intelligent agents.

**Base URL:** `https://production-api.potpie.ai`

**Authentication:** All endpoints require Bearer token authentication via the `Authorization` header.

---

## Table of Contents

1. [Create Conversation](#1-create-conversation)
2. [Parse Directory](#2-parse-directory)
3. [Get Parsing Status](#3-get-parsing-status)
4. [Post Message](#4-post-message)
5. [List Projects](#5-list-projects)
6. [List Available Agents](#6-list-available-agents)
7. [Search Codebase](#7-search-codebase)

---

## 1. Create Conversation

**Endpoint:** `POST /api/v1/conversations/`

**Description:** Create a new conversation for interacting with your codebase through AI agents.

### Request

```json
{
  "user_id": "user_123",
  "title": "Debug authentication flow",
  "status": "active",
  "project_ids": ["proj_456"],
  "agent_ids": ["debugging-agent"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | Your unique user identifier |
| `title` | string | Yes | Descriptive name for the conversation |
| `status` | string | Yes | Set to "active" for new conversations |
| `project_ids` | array[string] | Yes | Array of project IDs to associate |
| `agent_ids` | array[string] | Yes | Array of agent IDs to use |

### Response (200 OK)

```json
{
  "message": "Conversation created successfully",
  "conversation_id": "conv_789xyz"
}
```

### Use Cases

- Start a debugging session
- Begin code review conversations
- Ask questions about specific code sections
- Generate test plans
- Request code improvements

### Example (cURL)

```bash
curl -X POST https://production-api.potpie.ai/api/v1/conversations/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "title": "Debug authentication",
    "status": "active",
    "project_ids": ["proj_456"],
    "agent_ids": ["debugging-agent"]
  }'
```

### Example (Python)

```python
import requests

response = requests.post(
    'https://production-api.potpie.ai/api/v1/conversations/',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'user_id': 'user_123',
        'title': 'Debug authentication',
        'status': 'active',
        'project_ids': ['proj_456'],
        'agent_ids': ['debugging-agent']
    }
)

conversation_id = response.json()['conversation_id']
```

### Example (TypeScript)

```typescript
const response = await fetch('https://production-api.potpie.ai/api/v1/conversations/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'user_123',
    title: 'Debug authentication',
    status: 'active',
    project_ids: ['proj_456'],
    agent_ids: ['debugging-agent']
  })
});

const { conversation_id } = await response.json();
```

---

## 2. Parse Directory

**Endpoint:** `POST /api/v1/parse`

**Description:** Initiate parsing of a repository to build Potpie's knowledge graph.

### Request

```json
{
  "repo_name": "my-awesome-project",
  "repo_path": "/path/to/repo",
  "branch_name": "main"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `repo_name` | string | Conditional | Repository name (required if no repo_path) |
| `repo_path` | string | Conditional | Local or remote path (required if no repo_name) |
| `branch_name` | string | Yes | Branch to parse |

**Note:** Either `repo_name` or `repo_path` must be provided.

### Response (200 OK)

```json
{
  "project_id": "proj_123",
  "status": "submitted"
}
```

### Parsing Process

1. **Code Structure Analysis** - Identifies functions, classes, modules
2. **Dependency Mapping** - Builds relationship graph
3. **Semantic Understanding** - Extracts meaning from code
4. **Knowledge Graph Creation** - Stores structured data

### Parsing Time Estimates

| Codebase Size | Estimated Time |
|---------------|----------------|
| Small (< 1000 files) | 2-5 minutes |
| Medium (1000-5000 files) | 5-15 minutes |
| Large (> 5000 files) | 15-30 minutes |

### Example (cURL)

```bash
curl -X POST https://production-api.potpie.ai/api/v1/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_name": "my-project",
    "repo_path": "/path/to/repo",
    "branch_name": "main"
  }'
```

### Example (Python)

```python
import requests

response = requests.post(
    'https://production-api.potpie.ai/api/v1/parse',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'repo_name': 'my-project',
        'repo_path': '/path/to/repo',
        'branch_name': 'main'
    }
)

project_id = response.json()['project_id']
print(f"Parsing started for project: {project_id}")
```

---

## 3. Get Parsing Status

**Endpoint:** `GET /api/v1/parsing-status/{project_id}`

**Description:** Check the real-time parsing status of a project.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_id` | string | Yes | Unique project identifier |

### Response (200 OK)

```json
{
  "status": "in_progress",
  "progress": 65,
  "message": "Analyzing code structure"
}
```

### Status Values

| Status | Description | Progress |
|--------|-------------|----------|
| `pending` | Parsing queued | 0-10% |
| `in_progress` | Active parsing | 10-99% |
| `completed` | Parsing successful | 100% |
| `failed` | Parsing encountered errors | Variable |

### Parsing Phases

| Phase | Message | Progress Range |
|-------|---------|----------------|
| Initialization | "Initializing parser" | 0-10% |
| File Discovery | "Discovering source files" | 10-20% |
| Code Analysis | "Analyzing code structure" | 20-70% |
| Graph Building | "Building knowledge graph" | 70-90% |
| Finalization | "Finalizing analysis" | 90-100% |
| Complete | "Parsing completed" | 100% |

### Example (cURL)

```bash
curl -X GET https://production-api.potpie.ai/api/v1/parsing-status/proj_456 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example (Python) - Polling

```python
import requests
import time

def wait_for_parsing(project_id: str, timeout: int = 600):
    """Wait for parsing to complete."""
    start_time = time.time()

    while time.time() - start_time < timeout:
        response = requests.get(
            f'https://production-api.potpie.ai/api/v1/parsing-status/{project_id}',
            headers={'Authorization': 'Bearer YOUR_API_KEY'}
        )

        data = response.json()
        print(f"Status: {data['status']} - {data['progress']}% - {data['message']}")

        if data['status'] == 'completed':
            print("✓ Parsing completed!")
            return True
        elif data['status'] == 'failed':
            raise Exception(f"Parsing failed: {data['message']}")

        time.sleep(10)  # Check every 10 seconds

    raise TimeoutError("Parsing timeout")

# Usage
wait_for_parsing('proj_456')
```

### Example (TypeScript) - Async/Await

```typescript
async function waitForParsing(projectId: string): Promise<void> {
  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(
      `https://production-api.potpie.ai/api/v1/parsing-status/${projectId}`,
      {
        headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
      }
    );

    const data = await response.json();
    console.log(`${data.status} - ${data.progress}% - ${data.message}`);

    if (data.status === 'completed') {
      console.log('✓ Parsing complete!');
      return;
    }

    if (data.status === 'failed') {
      throw new Error(`Parsing failed: ${data.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
    attempts++;
  }

  throw new Error('Parsing timeout');
}
```

---

## 4. Post Message

**Endpoint:** `POST /api/v1/conversations/{conversation_id}/message/`

**Description:** Send a message to an existing conversation with AI agents.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation_id` | string | Yes | Unique conversation identifier |

### Request

```json
{
  "content": "How does the authentication flow work?",
  "node_ids": [
    {
      "node_id": "node_123",
      "name": "AuthService.authenticate"
    }
  ]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Your message or question |
| `node_ids` | array[object] | No | Specific code nodes to reference |

### Response (200 OK)

```json
{
  "message_id": "msg_abc123",
  "status": "processing"
}
```

### Message Types by Task

**Question & Answer:**
```
"What does the parseUserData function do?"
"Where is the JWT token validated?"
"How are database migrations handled?"
```

**Debugging:**
```
"I'm getting 'TypeError: Cannot read property...' in UserService"
"Why is the authentication failing for OAuth users?"
"The cache is not invalidating properly, can you investigate?"
```

**Code Review:**
```
"Review the error handling in the payment service"
"Is the API endpoint properly secured?"
"Suggest improvements for the authentication middleware"
```

**Test Generation:**
```
"Generate unit tests for the UserService class"
"What edge cases should I test for the payment flow?"
"Create integration tests for the authentication endpoints"
```

### Example (cURL)

```bash
curl -X POST https://production-api.potpie.ai/api/v1/conversations/conv_789/message/ \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "How does authentication work?"
  }'
```

### Example (Python) - With Context

```python
import requests

response = requests.post(
    'https://production-api.potpie.ai/api/v1/conversations/conv_789/message/',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'content': 'Can you explain how these components interact?',
        'node_ids': [
            {'node_id': 'node_123', 'name': 'AuthService'},
            {'node_id': 'node_456', 'name': 'UserController'}
        ]
    }
)

print(f"Message sent: {response.json()['message_id']}")
```

### Example (TypeScript) - Complete Workflow

```typescript
async function askQuestion(conversationId: string, question: string) {
  const response = await fetch(
    `https://production-api.potpie.ai/api/v1/conversations/${conversationId}/message/`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: question })
    }
  );

  const { message_id, status } = await response.json();
  console.log(`Message ${message_id} - Status: ${status}`);
  return message_id;
}
```

---

## 5. List Projects

**Endpoint:** `GET /api/v1/projects/list`

**Description:** Retrieve all projects associated with your account.

### Response (200 OK)

```json
[
  {
    "id": "proj_456abc",
    "name": "my-awesome-project",
    "repo_path": "/path/to/repo",
    "branch_name": "main",
    "status": "active",
    "created_at": "2024-02-09T10:30:00Z"
  },
  {
    "id": "proj_789def",
    "name": "backend-api",
    "repo_path": "github.com/org/backend-api",
    "branch_name": "develop",
    "status": "parsing",
    "created_at": "2024-02-09T11:15:00Z"
  }
]
```

### Project Status Values

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| `parsing` | Initial parsing in progress | Wait for completion |
| `active` | Ready for use | All operations available |
| `archived` | Archived project | Read-only access |
| `failed` | Parsing failed | Review errors, retry parsing |

### Example (cURL)

```bash
curl -X GET https://production-api.potpie.ai/api/v1/projects/list \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example (Python) - Filter Active Projects

```python
import requests

response = requests.get(
    'https://production-api.potpie.ai/api/v1/projects/list',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

projects = response.json()
active_projects = [p for p in projects if p['status'] == 'active']

print(f"Found {len(active_projects)} active projects:")
for project in active_projects:
    print(f"  - {project['name']} ({project['branch_name']})")
```

### Example (TypeScript) - Find Project by Name

```typescript
async function findProject(name: string) {
  const response = await fetch(
    'https://production-api.potpie.ai/api/v1/projects/list',
    {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    }
  );

  const projects = await response.json();
  return projects.find(p => p.name === name);
}

// Usage
const project = await findProject('my-awesome-project');
console.log(`Project ID: ${project?.id}`);
```

---

## 6. List Available Agents

**Endpoint:** `GET /api/v1/list-available-agents/`

**Description:** Get all available AI agents for conversations.

### Response (200 OK)

```json
[
  {
    "id": "debugging-agent",
    "name": "Debugging Agent",
    "description": "Expert at identifying and fixing bugs in your codebase"
  },
  {
    "id": "qna-agent",
    "name": "Q&A Agent",
    "description": "Answers questions about your codebase and explains how code works"
  },
  {
    "id": "code-changes-agent",
    "name": "Code Changes Agent",
    "description": "Generates code modifications and implements feature requests"
  },
  {
    "id": "unit-test-agent",
    "name": "Unit Test Agent",
    "description": "Generates unit tests for specific functions and classes"
  },
  {
    "id": "integration-test-agent",
    "name": "Integration Test Agent",
    "description": "Creates comprehensive integration test plans"
  }
]
```

### Agent Selection Guide

| Task | Recommended Agents |
|------|-------------------|
| Fix a bug | `debugging-agent` |
| Understand code | `qna-agent` |
| Write tests | `unit-test-agent`, `integration-test-agent` |
| Modify code | `code-changes-agent` |
| Code review | `qna-agent`, `code-changes-agent` |
| Architecture questions | `qna-agent` |
| Refactoring | `code-changes-agent` |

### Example (cURL)

```bash
curl -X GET https://production-api.potpie.ai/api/v1/list-available-agents/ \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example (Python) - Search Agents

```python
import requests

response = requests.get(
    'https://production-api.potpie.ai/api/v1/list-available-agents/',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

agents = response.json()

# Find agents with "test" in description
test_agents = [
    a for a in agents
    if 'test' in a['description'].lower()
]

print("Testing agents:")
for agent in test_agents:
    print(f"  - {agent['name']}: {agent['description']}")
```

### Example (TypeScript) - Get Agent IDs

```typescript
async function getAgentIds(): Promise<string[]> {
  const response = await fetch(
    'https://production-api.potpie.ai/api/v1/list-available-agents/',
    {
      headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    }
  );

  const agents = await response.json();
  return agents.map(agent => agent.id);
}

// Usage
const agentIds = await getAgentIds();
console.log('Available agents:', agentIds);
```

---

## 7. Search Codebase

**Endpoint:** `POST /api/v1/search`

**Description:** Perform semantic search across your codebase using natural language.

### Request

```json
{
  "project_id": "proj_456abc",
  "query": "authentication middleware and JWT validation"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `project_id` | string | Yes | Project to search within |
| `query` | string | Yes | Natural language search query |

### Response (200 OK)

```json
{
  "results": [
    {
      "node_id": "node_123",
      "name": "authenticate",
      "file_path": "src/auth/middleware.ts",
      "content": "export function authenticate(req, res, next) {...}",
      "match_type": "function",
      "relevance": 0.95
    },
    {
      "node_id": "node_456",
      "name": "verifyToken",
      "file_path": "src/auth/jwt.ts",
      "content": "function verifyToken(token: string): boolean {...}",
      "match_type": "function",
      "relevance": 0.87
    }
  ]
}
```

### Match Types

- `function` - Functions and methods
- `class` - Class definitions
- `interface` - TypeScript interfaces
- `type` - Type definitions
- `variable` - Variables and constants
- `component` - React/Vue components
- `method` - Class methods

### Search Query Examples

**Finding Functionality:**
```
"user authentication and login"
"error handling and logging"
"REST API endpoints for user management"
"database queries and ORM operations"
```

**Finding Implementations:**
```
"input validation and sanitization"
"cache implementation and management"
"application configuration and settings"
"unit tests for authentication"
```

### Example (cURL)

```bash
curl -X POST https://production-api.potpie.ai/api/v1/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_456",
    "query": "authentication middleware"
  }'
```

### Example (Python) - Filter by Relevance

```python
import requests

def search_codebase(project_id: str, query: str, min_relevance: float = 0.5):
    response = requests.post(
        'https://production-api.potpie.ai/api/v1/search',
        headers={
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        json={
            'project_id': project_id,
            'query': query
        }
    )

    data = response.json()
    results = [
        r for r in data['results']
        if r['relevance'] >= min_relevance
    ]

    return sorted(results, key=lambda x: x['relevance'], reverse=True)

# Usage
results = search_codebase('proj_456', 'authentication', min_relevance=0.8)
for result in results:
    print(f"✓ {result['name']} - {result['relevance']:.2%} relevant")
    print(f"  {result['file_path']}")
```

### Example (TypeScript) - Search and Use in Conversation

```typescript
async function searchAndAsk(projectId: string, query: string) {
  // 1. Search for relevant code
  const searchResponse = await fetch(
    'https://production-api.potpie.ai/api/v1/search',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ project_id: projectId, query })
    }
  );

  const { results } = await searchResponse.json();
  const topResults = results.slice(0, 3);

  // 2. Create conversation
  const convResponse = await fetch(
    'https://production-api.potpie.ai/api/v1/conversations/',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 'user_123',
        title: `Question about: ${query}`,
        status: 'active',
        project_ids: [projectId],
        agent_ids: ['qna-agent']
      })
    }
  );

  const { conversation_id } = await convResponse.json();

  // 3. Ask question with context
  await fetch(
    `https://production-api.potpie.ai/api/v1/conversations/${conversation_id}/message/`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Can you explain how this works?',
        node_ids: topResults.map(r => ({
          node_id: r.node_id,
          name: r.name
        }))
      })
    }
  );

  return conversation_id;
}
```

---

## Complete Integration Example

Here's a complete workflow integrating all 7 endpoints:

### Python Complete Example

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

    def parse_repo(self, repo_name: str, branch: str = 'main'):
        """Step 1: Parse repository"""
        response = requests.post(
            f'{self.base_url}/api/v1/parse',
            headers=self.headers,
            json={
                'repo_name': repo_name,
                'branch_name': branch
            }
        )
        return response.json()['project_id']

    def wait_for_parsing(self, project_id: str):
        """Step 2: Wait for parsing to complete"""
        while True:
            response = requests.get(
                f'{self.base_url}/api/v1/parsing-status/{project_id}',
                headers=self.headers
            )
            data = response.json()

            print(f"Parsing: {data['progress']}% - {data['message']}")

            if data['status'] == 'completed':
                return True
            elif data['status'] == 'failed':
                raise Exception(f"Parsing failed: {data['message']}")

            time.sleep(10)

    def list_projects(self):
        """Step 3: List all projects"""
        response = requests.get(
            f'{self.base_url}/api/v1/projects/list',
            headers=self.headers
        )
        return response.json()

    def list_agents(self):
        """Step 4: List available agents"""
        response = requests.get(
            f'{self.base_url}/api/v1/list-available-agents/',
            headers=self.headers
        )
        return response.json()

    def create_conversation(self, user_id: str, title: str,
                          project_ids: list, agent_ids: list):
        """Step 5: Create conversation"""
        response = requests.post(
            f'{self.base_url}/api/v1/conversations/',
            headers=self.headers,
            json={
                'user_id': user_id,
                'title': title,
                'status': 'active',
                'project_ids': project_ids,
                'agent_ids': agent_ids
            }
        )
        return response.json()['conversation_id']

    def search(self, project_id: str, query: str):
        """Step 6: Search codebase"""
        response = requests.post(
            f'{self.base_url}/api/v1/search',
            headers=self.headers,
            json={
                'project_id': project_id,
                'query': query
            }
        )
        return response.json()['results']

    def send_message(self, conversation_id: str, content: str, node_ids=None):
        """Step 7: Send message"""
        payload = {'content': content}
        if node_ids:
            payload['node_ids'] = node_ids

        response = requests.post(
            f'{self.base_url}/api/v1/conversations/{conversation_id}/message/',
            headers=self.headers,
            json=payload
        )
        return response.json()

# Complete workflow
def main():
    client = PotpieClient('YOUR_API_KEY')

    # 1. Parse repository
    print("1. Parsing repository...")
    project_id = client.parse_repo('my-awesome-project', 'main')

    # 2. Wait for parsing
    print("2. Waiting for parsing to complete...")
    client.wait_for_parsing(project_id)

    # 3. List projects
    print("3. Listing projects...")
    projects = client.list_projects()
    print(f"   Found {len(projects)} projects")

    # 4. List agents
    print("4. Getting available agents...")
    agents = client.list_agents()
    agent_ids = [a['id'] for a in agents[:2]]  # Use first 2 agents

    # 5. Create conversation
    print("5. Creating conversation...")
    conv_id = client.create_conversation(
        'user_123',
        'Code Review Session',
        [project_id],
        agent_ids
    )

    # 6. Search codebase
    print("6. Searching codebase...")
    results = client.search(project_id, 'authentication middleware')
    print(f"   Found {len(results)} results")

    # 7. Ask question with context
    print("7. Sending message with context...")
    node_ids = [
        {'node_id': r['node_id'], 'name': r['name']}
        for r in results[:3]
    ]
    client.send_message(
        conv_id,
        'Can you explain how authentication works?',
        node_ids
    )

    print("✓ Complete workflow finished successfully!")

if __name__ == '__main__':
    main()
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Request body validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Something went wrong |

### Error Response Format

```json
{
  "detail": [
    {
      "loc": ["body", "project_id"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Error Handling Example

```python
try:
    response = requests.post(endpoint, headers=headers, json=data)
    response.raise_for_status()
    return response.json()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        print("Invalid API key")
    elif e.response.status_code == 429:
        print("Rate limit exceeded - wait and retry")
    elif e.response.status_code == 422:
        print(f"Validation error: {e.response.json()}")
    else:
        print(f"API error: {e}")
    raise
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
    raise
```

---

## Rate Limits

| Resource | Limit |
|----------|-------|
| API Requests | 1000 requests/hour |
| Parsing Jobs | 5 concurrent parsings |
| Message Rate | 10 messages/minute per conversation |
| Search Queries | 100 searches/minute |

---

## Best Practices

### 1. Authentication
- Store API keys in environment variables
- Never commit keys to version control
- Use different keys for dev/production
- Rotate keys periodically

### 2. Error Handling
- Always check HTTP status codes
- Implement retry logic with exponential backoff
- Log errors for debugging
- Handle rate limits gracefully

### 3. Performance
- Cache agent and project lists
- Implement request debouncing for search
- Poll parsing status at reasonable intervals (10s)
- Use appropriate timeouts

### 4. Conversation Management
- Use descriptive conversation titles
- Associate relevant projects for context
- Choose appropriate agents for tasks
- Keep conversations focused

### 5. Search Optimization
- Use natural language queries
- Filter results by relevance threshold
- Pass node IDs to conversations for context
- Cache frequent searches

---

## Support

- **Documentation:** https://docs.potpie.ai
- **Discord Community:** https://discord.gg/ryk5CMD5v6
- **GitHub Issues:** https://github.com/potpie-ai/potpie/issues
- **Email:** hi@potpie.ai

---

## Quick Reference

```bash
# Authentication
-H "Authorization: Bearer YOUR_API_KEY"

# Base URL
https://production-api.potpie.ai

# Endpoints
POST   /api/v1/conversations/                          # Create conversation
POST   /api/v1/parse                                    # Parse repository
GET    /api/v1/parsing-status/{project_id}            # Get parsing status
POST   /api/v1/conversations/{conversation_id}/message/  # Send message
GET    /api/v1/projects/list                           # List projects
GET    /api/v1/list-available-agents/                  # List agents
POST   /api/v1/search                                   # Search codebase
```
