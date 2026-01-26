<?php

require_once __DIR__ . '/../../backend/php/RabbitMQClient.php';

class RabbitMQClientTest extends PHPUnit\Framework\TestCase {
    private $config;
    private $client;

    protected function setUp(): void {
        $this->config = [
            'host' => getenv('RABBITMQ_HOST') ?: 'localhost',
            'port' => getenv('RABBITMQ_PORT') ?: 5672,
            'user' => getenv('RABBITMQ_USER') ?: 'challenge',
            'password' => getenv('RABBITMQ_PASS') ?: 'challenge123',
            'vhost' => getenv('RABBITMQ_VHOST') ?: 'challenge_vhost'
        ];

        $this->client = new RabbitMQClient($this->config);
    }

    public function testConnection() {
        $connectionStatus = $this->client->checkConnection();
        $this->assertEquals('connected', $connectionStatus['status']);
        $this->assertEquals($this->config['host'], $connectionStatus['host']);
    }

    public function testCreateMessage() {
        $testData = ['content' => 'Test message', 'priority' => 'normal'];
        $message = $this->client->createMessage('test_queue', $testData);

        $this->assertArrayHasKey('id', $message);
        $this->assertArrayHasKey('timestamp', $message);
        $this->assertEquals($testData, $message['data']);
        $this->assertEquals('created', $message['status']);
    }

    public function testGetMessages() {
        // First create a test message
        $testData = ['content' => 'Test message for retrieval', 'priority' => 'high'];
        $this->client->createMessage('test_queue', $testData);

        $messages = $this->client->getMessages('test_queue');

        $this->assertIsArray($messages);
        $this->assertGreaterThanOrEqual(1, count($messages));

        if (!empty($messages)) {
            $message = $messages[0];
            $this->assertArrayHasKey('id', $message);
            $this->assertArrayHasKey('data', $message);
            $this->assertArrayHasKey('status', $message);
        }
    }

    public function testUpdateMessage() {
        // Create a test message
        $originalData = ['content' => 'Original content', 'priority' => 'normal'];
        $createdMessage = $this->client->createMessage('test_queue', $originalData);

        // Update the message
        $newData = ['content' => 'Updated content', 'priority' => 'high'];
        $updateResult = $this->client->updateMessage('test_queue', $createdMessage['id'], $newData);

        $this->assertTrue($updateResult);
    }

    public function testDeleteMessage() {
        // Create a test message
        $testData = ['content' => 'Message to delete', 'priority' => 'normal'];
        $createdMessage = $this->client->createMessage('test_queue', $testData);

        // Delete the message
        $deleteResult = $this->client->deleteMessage('test_queue', $createdMessage['id']);

        $this->assertTrue($deleteResult);
    }

    public function testGetLogs() {
        $logs = $this->client->getLogs();

        $this->assertIsArray($logs);
        $this->assertGreaterThanOrEqual(1, count($logs));

        if (!empty($logs)) {
            $log = $logs[0];
            $this->assertArrayHasKey('timestamp', $log);
            $this->assertArrayHasKey('level', $log);
            $this->assertArrayHasKey('message', $log);
            $this->assertArrayHasKey('source', $log);
        }
    }

    public function testErrorHandling() {
        $this->expectException(Exception::class);

        // Try to create message with invalid queue name (should fail)
        $this->client->createMessage('', ['invalid' => 'data']);
    }

    protected function tearDown(): void {
        // Clean up test queue
        try {
            $this->client->deleteMessage('test_queue', 'dummy-id');
        } catch (Exception $e) {
            // Ignore cleanup errors
        }
    }
}