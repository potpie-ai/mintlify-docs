# Potpie API Quick Start Guide

Get started with Potpie API in 5 minutes.

## Prerequisites

- Potpie account (sign up at [app.potpie.ai](https://app.potpie.ai))
- API key from [dashboard settings](https://app.potpie.ai/settings/api-keys)
- A codebase you want to analyze

## Installation

### Node.js/TypeScript

```bash
npm install node-fetch
# or
yarn add node-fetch
```

### Python

```bash
pip install requests
```

## Quick Start

### Step 1: Parse Your Repository

```typescript
// TypeScript
const response = await fetch('https://production-api.potpie.ai/api/v1/parse', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    repo_name: 'my-project',
    repo_path: '/path/to/repo',
    branch_name: 'main'
  })
});

const { project_id } = await response.json();
console.log('Parsing initiated:', project_id);
```

```python
# Python
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
print(f'Parsing initiated: {project_id}')
```

### Step 2: Wait for Parsing to Complete

```typescript
// TypeScript
async function waitForParsing(projectId: string) {
  while (true) {
    const response = await fetch(
      `https://production-api.potpie.ai/api/v1/parsing-status/${projectId}`,
      {
        headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
      }
    );

    const { status, progress } = await response.json();
    console.log(`Status: ${status} - ${progress}%`);

    if (status === 'ready') break;
    if (status === 'failed') throw new Error('Parsing failed');

    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s
  }
}

await waitForParsing(project_id);
```

```python
# Python
import time

def wait_for_parsing(project_id):
    while True:
        response = requests.get(
            f'https://production-api.potpie.ai/api/v1/parsing-status/{project_id}',
            headers={'Authorization': 'Bearer YOUR_API_KEY'}
        )

        data = response.json()
        print(f"Status: {data['status']} - {data['progress']}%")

        if data['status'] == 'ready':
            break
        if data['status'] == 'failed':
            raise Exception('Parsing failed')

        time.sleep(10)

wait_for_parsing(project_id)
```

### Step 3: Create a Conversation

```typescript
// TypeScript
const conversationResponse = await fetch(
  'https://production-api.potpie.ai/api/v1/conversations/',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: 'your_user_id',
      title: 'My First Conversation',
      status: 'active',
      project_ids: [project_id],
      agent_ids: ['qna-agent']
    })
  }
);

const { conversation_id } = await conversationResponse.json();
console.log('Conversation created:', conversation_id);
```

```python
# Python
conversation_response = requests.post(
    'https://production-api.potpie.ai/api/v1/conversations/',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'user_id': 'your_user_id',
        'title': 'My First Conversation',
        'status': 'active',
        'project_ids': [project_id],
        'agent_ids': ['qna-agent']
    }
)

conversation_id = conversation_response.json()['conversation_id']
print(f'Conversation created: {conversation_id}')
```

### Step 4: Ask Questions

```typescript
// TypeScript
const messageResponse = await fetch(
  `https://production-api.potpie.ai/api/v1/conversations/${conversation_id}/message/`,
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: 'How does authentication work in this codebase?'
    })
  }
);

console.log('Message sent successfully!');
```

```python
# Python
message_response = requests.post(
    f'https://production-api.potpie.ai/api/v1/conversations/{conversation_id}/message/',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'content': 'How does authentication work in this codebase?'
    }
)

print('Message sent successfully!')
```

## Complete Example

### TypeScript

```typescript
// complete-example.ts
const POTPIE_API_KEY = process.env.POTPIE_API_KEY!;
const BASE_URL = 'https://production-api.potpie.ai';

async function main() {
  try {
    // 1. Parse repository
    console.log('1. Starting parsing...');
    const parseResponse = await fetch(`${BASE_URL}/api/v1/parse`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POTPIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repo_name: 'my-project',
        repo_path: '/path/to/repo',
        branch_name: 'main'
      })
    });
    const { project_id } = await parseResponse.json();

    // 2. Wait for parsing
    console.log('2. Waiting for parsing to complete...');
    while (true) {
      const statusResponse = await fetch(
        `${BASE_URL}/api/v1/parsing-status/${project_id}`,
        { headers: { 'Authorization': `Bearer ${POTPIE_API_KEY}` } }
      );
      const { status } = await statusResponse.json();

      if (status === 'ready') break;
      if (status === 'failed') throw new Error('Parsing failed');

      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // 3. Create conversation
    console.log('3. Creating conversation...');
    const convResponse = await fetch(`${BASE_URL}/api/v1/conversations/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POTPIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 'user_123',
        title: 'Quick Start Conversation',
        status: 'active',
        project_ids: [project_id],
        agent_ids: ['qna-agent']
      })
    });
    const { conversation_id } = await convResponse.json();

    // 4. Send message
    console.log('4. Asking question...');
    await fetch(
      `${BASE_URL}/api/v1/conversations/${conversation_id}/message/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${POTPIE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: 'How does authentication work in this codebase?'
        })
      }
    );

    console.log('✅ Success! Conversation ID:', conversation_id);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
```

### Python

```python
# complete_example.py
import os
import time
import requests

POTPIE_API_KEY = os.environ['POTPIE_API_KEY']
BASE_URL = 'https://production-api.potpie.ai'

def main():
    try:
        # 1. Parse repository
        print('1. Starting parsing...')
        parse_response = requests.post(
            f'{BASE_URL}/api/v1/parse',
            headers={
                'Authorization': f'Bearer {POTPIE_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'repo_name': 'my-project',
                'repo_path': '/path/to/repo',
                'branch_name': 'main'
            }
        )
        project_id = parse_response.json()['project_id']

        # 2. Wait for parsing
        print('2. Waiting for parsing to complete...')
        while True:
            status_response = requests.get(
                f'{BASE_URL}/api/v1/parsing-status/{project_id}',
                headers={'Authorization': f'Bearer {POTPIE_API_KEY}'}
            )
            data = status_response.json()

            if data['status'] == 'ready':
                break
            if data['status'] == 'failed':
                raise Exception('Parsing failed')

            time.sleep(10)

        # 3. Create conversation
        print('3. Creating conversation...')
        conv_response = requests.post(
            f'{BASE_URL}/api/v1/conversations/',
            headers={
                'Authorization': f'Bearer {POTPIE_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'user_id': 'user_123',
                'title': 'Quick Start Conversation',
                'status': 'active',
                'project_ids': [project_id],
                'agent_ids': ['qna-agent']
            }
        )
        conversation_id = conv_response.json()['conversation_id']

        # 4. Send message
        print('4. Asking question...')
        requests.post(
            f'{BASE_URL}/api/v1/conversations/{conversation_id}/message/',
            headers={
                'Authorization': f'Bearer {POTPIE_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'content': 'How does authentication work in this codebase?'
            }
        )

        print(f'✅ Success! Conversation ID: {conversation_id}')

    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == '__main__':
    main()
```

## Testing with cURL

```bash
#!/bin/bash

# Set your API key
export POTPIE_API_KEY="your_api_key_here"
BASE_URL="https://production-api.potpie.ai"

# 1. Parse repository
echo "1. Starting parsing..."
PARSE_RESPONSE=$(curl -s -X POST \
  "${BASE_URL}/api/v1/parse" \
  -H "Authorization: Bearer ${POTPIE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "repo_name": "my-project",
    "repo_path": "/path/to/repo",
    "branch_name": "main"
  }')

PROJECT_ID=$(echo $PARSE_RESPONSE | jq -r '.project_id')
echo "Project ID: ${PROJECT_ID}"

# 2. Wait for parsing
echo "2. Waiting for parsing..."
while true; do
  STATUS_RESPONSE=$(curl -s -X GET \
    "${BASE_URL}/api/v1/parsing-status/${PROJECT_ID}" \
    -H "Authorization: Bearer ${POTPIE_API_KEY}")

  STATUS=$(echo $STATUS_RESPONSE | jq -r '.status')
  echo "Status: ${STATUS}"

  if [ "$STATUS" = "ready" ]; then
    break
  fi

  if [ "$STATUS" = "failed" ]; then
    echo "Parsing failed!"
    exit 1
  fi

  sleep 10
done

# 3. Create conversation
echo "3. Creating conversation..."
CONV_RESPONSE=$(curl -s -X POST \
  "${BASE_URL}/api/v1/conversations/" \
  -H "Authorization: Bearer ${POTPIE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"user_123\",
    \"title\": \"Quick Start Conversation\",
    \"status\": \"active\",
    \"project_ids\": [\"${PROJECT_ID}\"],
    \"agent_ids\": [\"qna-agent\"]
  }")

CONVERSATION_ID=$(echo $CONV_RESPONSE | jq -r '.conversation_id')
echo "Conversation ID: ${CONVERSATION_ID}"

# 4. Send message
echo "4. Sending message..."
curl -X POST \
  "${BASE_URL}/api/v1/conversations/${CONVERSATION_ID}/message/" \
  -H "Authorization: Bearer ${POTPIE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "How does authentication work in this codebase?"
  }'

echo "✅ Success!"
```

## Next Steps

1. **Explore More Endpoints**: Check out the full [API Reference](/api-reference/introduction)
2. **Search Your Codebase**: Use the [Search Codebase](/api-reference/endpoint/search-codebase) endpoint
3. **Try Different Agents**: See available agents with [List Agents](/api-reference/endpoint/list-agents)
4. **Build Integrations**: Create custom workflows with multiple endpoints

## Common Issues

### "Unauthorized" Error
- Verify your API key is correct
- Ensure you're using the `Bearer` prefix in the Authorization header
- Check that your API key hasn't expired

### Parsing Takes Too Long
- Large repositories can take 15-30 minutes
- Check parsing status regularly
- Ensure repository is accessible

### "Project Not Found" Error
- Wait for parsing to complete before creating conversations
- Verify project_id is correct
- List all projects to confirm it exists

## Support

- **Documentation**: [docs.potpie.ai](https://docs.potpie.ai)
- **Discord**: [Join our community](https://discord.gg/ryk5CMD5v6)
- **Email**: hi@potpie.ai
