# LeetCode Solution Automation Hub

A Vercel-hosted API endpoint to receive accepted LeetCode solutions.

## Endpoint

POST `/api/solutions`

## Example Payload

```json
{
  "problemTitle": "Two Sum",
  "problemNumber": 1,
  "difficulty": "Easy",
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "tags": ["array", "hash-table"],
  "capturedAt": "2024-01-01T12:00:00.000Z",
  "automated": true
}
```
