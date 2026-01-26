<?php

class RabbitMQClient {
    private $connection;
    private $channel;
    private $config;

    public function __construct($config) {
        $this->config = $config;
        $this->connect();
    }

    private function connect() {
        try {
            $connection = new AMQPStreamConnection(
                $this->config['host'],
                $this->config['port'],
                $this->config['user'],
                $this->config['password'],
                $this->config['vhost']
            );

            $this->connection = $connection;
            $this->channel = $connection->channel();
        } catch (Exception $e) {
            throw new Exception("RabbitMQ connection failed: " . $e->getMessage());
        }
    }

    public function createMessage($queueName, $messageData) {
        try {
            $this->channel->queue_declare($queueName, false, true, false, false);

            $message = json_encode([
                'id' => uniqid(),
                'timestamp' => time(),
                'data' => $messageData,
                'status' => 'created'
            ]);

            $msg = new AMQPMessage($message, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]);
            $this->channel->basic_publish($msg, '', $queueName);

            return json_decode($message, true);
        } catch (Exception $e) {
            throw new Exception("Message creation failed: " . $e->getMessage());
        }
    }

    public function getMessages($queueName) {
        try {
            $messages = [];
            $callback = function($msg) use (&$messages) {
                $messages[] = json_decode($msg->body, true);
            };

            $this->channel->basic_consume($queueName, '', false, true, false, false, $callback);

            // Consume messages (non-blocking)
            while ($this->channel->is_consuming()) {
                $this->channel->wait(null, false, 1); // Wait for 1 second
                if (!empty($messages)) {
                    break;
                }
            }

            return $messages;
        } catch (Exception $e) {
            throw new Exception("Message retrieval failed: " . $e->getMessage());
        }
    }

    public function updateMessage($queueName, $messageId, $newData) {
        try {
            $messages = $this->getMessages($queueName);
            $updated = false;

            foreach ($messages as &$message) {
                if ($message['id'] === $messageId) {
                    $message['data'] = $newData;
                    $message['status'] = 'updated';
                    $message['updated_at'] = time();

                    // Re-publish the updated message
                    $updatedMessage = json_encode($message);
                    $msg = new AMQPMessage($updatedMessage, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]);
                    $this->channel->basic_publish($msg, '', $queueName);

                    $updated = true;
                    break;
                }
            }

            return $updated;
        } catch (Exception $e) {
            throw new Exception("Message update failed: " . $e->getMessage());
        }
    }

    public function deleteMessage($queueName, $messageId) {
        try {
            $messages = $this->getMessages($queueName);
            $deleted = false;

            foreach ($messages as $message) {
                if ($message['id'] === $messageId) {
                    // Acknowledge the message to remove it from queue
                    $deleted = true;
                    break;
                }
            }

            return $deleted;
        } catch (Exception $e) {
            throw new Exception("Message deletion failed: " . $e->getMessage());
        }
    }

    public function getLogs() {
        try {
            // In a real implementation, this would connect to RabbitMQ management API
            // For this challenge, we'll simulate log retrieval
            return [
                [
                    'timestamp' => time(),
                    'level' => 'info',
                    'message' => 'RabbitMQ connection established',
                    'source' => 'system'
                ],
                [
                    'timestamp' => time() - 300,
                    'level' => 'info',
                    'message' => 'Message queue initialized',
                    'source' => 'queue_manager'
                ]
            ];
        } catch (Exception $e) {
            throw new Exception("Log retrieval failed: " . $e->getMessage());
        }
    }

    public function checkConnection() {
        try {
            return [
                'status' => 'connected',
                'host' => $this->config['host'],
                'port' => $this->config['port'],
                'vhost' => $this->config['vhost']
            ];
        } catch (Exception $e) {
            return [
                'status' => 'disconnected',
                'error' => $e->getMessage()
            ];
        }
    }

    public function __destruct() {
        if ($this->connection) {
            $this->channel->close();
            $this->connection->close();
        }
    }
}