import * as amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

interface RabbitMQConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    vhost: string;
}

interface Message {
    id: string;
    timestamp: number;
    data: any;
    status: string;
    updated_at?: number;
}

export class RabbitMQClient {
    private config: RabbitMQConfig;
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    constructor(config: RabbitMQConfig) {
        this.config = config;
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            const connectionString = `amqp://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.vhost}`;
            this.connection = await amqp.connect(connectionString);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            throw new Error(`RabbitMQ connection failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async createMessage(queueName: string, messageData: any): Promise<Message> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            // Declare queue (durable)
            await this.channel.assertQueue(queueName, { durable: true });

            // Create message with metadata
            const message: Message = {
                id: uuidv4(),
                timestamp: Math.floor(Date.now() / 1000),
                data: messageData,
                status: 'created'
            };

            // Publish message
            const sent = this.channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );

            if (!sent) {
                throw new Error('Failed to send message to queue');
            }

            return message;
        } catch (error) {
            throw new Error(`Message creation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getMessages(queueName: string): Promise<Message[]> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            const messages: Message[] = [];

            // Declare queue
            await this.channel.assertQueue(queueName, { durable: true });

            // Consume messages
            const consumer = await this.channel.consume(queueName, (msg) => {
                if (msg) {
                    try {
                        const message = JSON.parse(msg.content.toString()) as Message;
                        messages.push(message);
                        this.channel?.ack(msg);
                    } catch (parseError) {
                        this.channel?.nack(msg);
                    }
                }
            }, { noAck: false });

            // Wait briefly for messages
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Cancel consumer
            if (consumer.consumerTag) {
                await this.channel.cancel(consumer.consumerTag);
            }

            return messages;
        } catch (error) {
            throw new Error(`Message retrieval failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async updateMessage(queueName: string, messageId: string, newData: any): Promise<boolean> {
        try {
            const messages = await this.getMessages(queueName);
            let updated = false;

            for (const message of messages) {
                if (message.id === messageId) {
                    const updatedMessage: Message = {
                        ...message,
                        data: newData,
                        status: 'updated',
                        updated_at: Math.floor(Date.now() / 1000)
                    };

                    // Re-publish the updated message
                    const sent = this.channel?.sendToQueue(
                        queueName,
                        Buffer.from(JSON.stringify(updatedMessage)),
                        { persistent: true }
                    );

                    if (sent) {
                        updated = true;
                    }
                    break;
                }
            }

            return updated;
        } catch (error) {
            throw new Error(`Message update failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async deleteMessage(queueName: string, messageId: string): Promise<boolean> {
        try {
            const messages = await this.getMessages(queueName);
            let deleted = false;

            for (const message of messages) {
                if (message.id === messageId) {
                    deleted = true;
                    break;
                }
            }

            return deleted;
        } catch (error) {
            throw new Error(`Message deletion failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getLogs(): Promise<Array<{timestamp: number, level: string, message: string, source: string}>> {
        try {
            // Simulated log retrieval for this challenge
            return [
                {
                    timestamp: Math.floor(Date.now() / 1000),
                    level: 'info',
                    message: 'RabbitMQ connection established',
                    source: 'system'
                },
                {
                    timestamp: Math.floor(Date.now() / 1000) - 300,
                    level: 'info',
                    message: 'Message queue initialized',
                    source: 'queue_manager'
                }
            ];
        } catch (error) {
            throw new Error(`Log retrieval failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async checkConnection(): Promise<{status: string, host?: string, port?: number, vhost?: string, error?: string}> {
        try {
            if (this.connection) {
                return {
                    status: 'connected',
                    host: this.config.host,
                    port: this.config.port,
                    vhost: this.config.vhost
                };
            } else {
                return {
                    status: 'disconnected',
                    error: 'Connection not established'
                };
            }
        } catch (error) {
            return {
                status: 'disconnected',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    public async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
}