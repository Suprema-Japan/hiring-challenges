import { RabbitMQClient } from '../../backend/typescript/rabbitmqClient';

describe('RabbitMQClient TypeScript Implementation', () => {
    let client: RabbitMQClient;
    const config = {
        host: process.env.RABBITMQ_HOST || 'localhost',
        port: parseInt(process.env.RABBITMQ_PORT || '5672'),
        user: process.env.RABBITMQ_USER || 'challenge',
        password: process.env.RABBITMQ_PASS || 'challenge123',
        vhost: process.env.RABBITMQ_VHOST || 'challenge_vhost'
    };

    beforeAll(async () => {
        client = new RabbitMQClient(config);
    });

    afterAll(async () => {
        await client.close();
    });

    test('should connect to RabbitMQ', async () => {
        const connectionStatus = await client.checkConnection();
        expect(connectionStatus.status).toBe('connected');
        expect(connectionStatus.host).toBe(config.host);
    });

    test('should create a message', async () => {
        const testData = { content: 'Test message from TypeScript', priority: 'normal' };
        const message = await client.createMessage('test_queue', testData);

        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('timestamp');
        expect(message.data).toEqual(testData);
        expect(message.status).toBe('created');
    });

    test('should get messages from queue', async () => {
        // First create a test message
        const testData = { content: 'TypeScript test message for retrieval', priority: 'high' };
        await client.createMessage('test_queue', testData);

        const messages = await client.getMessages('test_queue');

        expect(Array.isArray(messages)).toBe(true);
        expect(messages.length).toBeGreaterThanOrEqual(1);

        if (messages.length > 0) {
            const message = messages[0];
            expect(message).toHaveProperty('id');
            expect(message).toHaveProperty('data');
            expect(message).toHaveProperty('status');
        }
    });

    test('should update a message', async () => {
        // Create a test message
        const originalData = { content: 'Original TypeScript content', priority: 'normal' };
        const createdMessage = await client.createMessage('test_queue', originalData);

        // Update the message
        const newData = { content: 'Updated TypeScript content', priority: 'high' };
        const updateResult = await client.updateMessage('test_queue', createdMessage.id, newData);

        expect(updateResult).toBe(true);
    });

    test('should delete a message', async () => {
        // Create a test message
        const testData = { content: 'TypeScript message to delete', priority: 'normal' };
        const createdMessage = await client.createMessage('test_queue', testData);

        // Delete the message
        const deleteResult = await client.deleteMessage('test_queue', createdMessage.id);

        expect(deleteResult).toBe(true);
    });

    test('should get system logs', async () => {
        const logs = await client.getLogs();

        expect(Array.isArray(logs)).toBe(true);
        expect(logs.length).toBeGreaterThanOrEqual(1);

        if (logs.length > 0) {
            const log = logs[0];
            expect(log).toHaveProperty('timestamp');
            expect(log).toHaveProperty('level');
            expect(log).toHaveProperty('message');
            expect(log).toHaveProperty('source');
        }
    });

    test('should handle errors gracefully', async () => {
        // Test with invalid queue name
        await expect(client.createMessage('', { invalid: 'data' }))
            .rejects
            .toThrow();
    });
});