# 🐇 RabbitMQ Message Broker Challenge

Welcome to the **RabbitMQ Message Broker Challenge** - a flexible technical assessment for evaluating message queue implementation skills.

## 📚 Challenge Overview

This challenge evaluates your ability to:
- Work with RabbitMQ message brokers
- Implement CRUD operations for customer data
- Choose and justify your technical approach
- Write comprehensive tests and documentation

### Key Features

-  **Flexible Implementation**: Choose any programming language (PHP, Python, TypeScript examples provided)
- **Customer Data Focus**: Real-world customer data management scenario
- **Multiple Setup Options**: Docker, Cloud, or Local RabbitMQ installation
- **Comprehensive Testing**: Example test suites and coverage requirements
- **Optional Frontend**: Encouraged but not required

## 🎯 Objectives

1. **Message Broker Understanding**: Demonstrate RabbitMQ setup and configuration skills
2. **CRUD Operations**: Implement Create, Read, Update, and Delete for customer data
3. **Flexible Implementation**: Choose your preferred language and architecture
4. **Documentation & Testing**: Provide clear documentation and thorough tests

## 📖 The Task: Customer Data Management System

You are required to build a **RabbitMQ-based customer data management system** that performs CRUD operations on customer records. You have complete flexibility in implementation approach.

### Customer Data Structure

```json
{
  "customer_id": "unique-identifier",
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Tokyo",
    "postal_code": "100-0001"
  },
  "status": "active|inactive|pending",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Required Operations

Implement these operations in your chosen language:

```javascript
// Example interface - implement in your language
createCustomer(customerData)
getCustomer(customerId)
updateCustomer(customerId, updatedData)
deleteCustomer(customerId)
getCustomerLogs()
checkConnection()
```

## 🛠 Implementation Requirements

### 1. Flexible Environment Setup

Choose **one** of these approaches:

#### Option A: Docker 
```bash
# Example docker-compose.yml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.11-management
    ports:
      - "5672:5672"      # AMQP
      - "15672:15672"    # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: your_user
      RABBITMQ_DEFAULT_PASS: your_password
```

#### Option B: Cloud Service
- Use RabbitMQ cloud providers (CloudAMQP, AWS MQ, etc.)
- Provide connection details in your documentation
- Include setup instructions for your chosen service

#### Option C: Local Installation
```bash
# macOS (Homebrew)
brew install rabbitmq
brew services start rabbitmq

# Windows (Chocolatey)
choco install rabbitmq
rabbitmq-server

# Linux (Debian/Ubuntu)
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

### 2. Environment Configuration

Create `.env` file for your implementation:

```env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=your_user
RABBITMQ_PASS=your_password
RABBITMQ_VHOST=/  # or your virtual host
```

### 3. Backend Implementation

We provide example implementations in:
- **PHP 8+**: `backend/php/RabbitMQClient.php`
- **Python 3.9+**: `backend/python/rabbitmq_client.py`
- **TypeScript 4.9+**: `backend/typescript/rabbitmqClient.ts`

**You can:**
- Use these as reference implementations
- Modify and improve the existing code
- Create your own implementation from scratch
- Use any programming language you prefer

### 4. Queue Structure (Suggested)

```
customer_queue       - Main customer data queue (durable)
customer_logs        - Audit trail of all changes
customer_dlq         - Dead letter queue for failed operations
```

### 5. Frontend (Optional)

You have the option to create a frontend interface:
- **Not required** but encouraged for full-stack demonstration
- Can be simple HTML/JS or use any framework
- Should demonstrate CRUD operations working
- Design is completely up to you

## 🧪 Testing Requirements

We provide example test suites in:
- **PHP**: `tests/php/RabbitMQClientTest.php` (PHPUnit)
- **Python**: `tests/python/test_rabbitmq_client.py` (pytest)
- **TypeScript**: `tests/typescript/rabbitmqClient.test.ts` (Jest)

### Test Coverage Requirements

Your tests should cover:
1. **Connection Handling**: Verify RabbitMQ connectivity
2. **CRUD Operations**: Test all customer data operations
3. **Error Scenarios**: Invalid data, network failures
4. **Edge Cases**: Empty queues, large messages
5. **Performance**: Message throughput and latency

### Running Provided Tests

```bash
# PHP
cd backend/php
php vendor/bin/phpunit tests

# Python
cd backend/python
python -m pytest tests

# TypeScript
cd backend/typescript
npm test
```

## 📤 Submission Instructions

Please provide a compressed (`.zip`) folder containing:
1. **Backend implementation** (your chosen language)
2. **Frontend code** (if you created one)
3. **Setup instructions** (Docker, local, or cloud configuration)
4. **Documentation** (setup and usage guides)
5. **Test cases** (for your implementation)
6. **Sample configuration files** (`.env` examples)
7. **Any additional resources** needed to run your solution

## 🎯 Evaluation Criteria

Your implementation will be evaluated on:

1. **Functionality** (40%): Do all CRUD operations work correctly with customer data?
2. **Code Quality** (20%): Clean, maintainable, well-documented code
3. **Error Handling** (15%): Robust and comprehensive error management
4. **Testing** (15%): Thorough test coverage and edge case handling
5. **Documentation** (10%): Clear setup and usage guides

## 💡 Tips

1. **Start Simple**: Get basic customer operations working first
2. **Test Early**: Write tests as you develop each feature
3. **Document Everything**: Make it easy for reviewers to understand
4. **Handle Edge Cases**: Think about real-world scenarios
5. **Optimize Later**: Focus on correctness first, then performance

## 📚 Additional Resources

### Example Implementations
- **PHP**: Uses php-amqplib for RabbitMQ connectivity
- **Python**: Uses pika library with async support
- **TypeScript**: Uses amqplib with Promise-based API

### RabbitMQ Best Practices
```yaml
# Recommended queue properties
durable: true              # Survive broker restarts
auto_delete: false         # Don't auto-delete queues
arguments:
  x-message-ttl: 86400000  # 24 hour TTL
  x-dead-letter-exchange: "customer_dlq"
```

### Troubleshooting Guide

**Connection Issues:**
```bash
# Check RabbitMQ status
rabbitmqctl status

# Test connection
telnet localhost 5672

# Verify credentials
rabbitmqctl list_users
```

**Message Delivery Problems:**
- Check queue bindings: `rabbitmqctl list_bindings`
- Verify message persistence settings
- Review consumer acknowledgment logic
- Check dead letter queue for failed messages

## 🚀 Getting Started Checklist

- [ ] Read this entire challenge document
- [ ] Choose your implementation approach (language, setup)
- [ ] Set up RabbitMQ using your preferred method
- [ ] Review example implementations (optional)
- [ ] Implement customer data CRUD operations
- [ ] Write comprehensive tests
- [ ] Create setup documentation
- [ ] Test your implementation thoroughly
- [ ] Package everything for submission

Good luck with your implementation! We're excited to see your creative solutions. 🚀