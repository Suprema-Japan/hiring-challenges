import unittest
import os
import json
from dotenv import load_dotenv
from backend.python.rabbitmq_client import RabbitMQClient

class TestRabbitMQClient(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load environment variables
        load_dotenv()

        # Set up RabbitMQ client
        cls.config = {
            'host': os.getenv('RABBITMQ_HOST', 'localhost'),
            'port': int(os.getenv('RABBITMQ_PORT', 5672)),
            'user': os.getenv('RABBITMQ_USER', 'challenge'),
            'password': os.getenv('RABBITMQ_PASS', 'challenge123'),
            'vhost': os.getenv('RABBITMQ_VHOST', 'challenge_vhost')
        }

        cls.client = RabbitMQClient(cls.config)

    def test_connection(self):
        connection_status = self.client.check_connection()
        self.assertEqual(connection_status['status'], 'connected')
        self.assertEqual(connection_status['host'], self.config['host'])

    def test_create_message(self):
        test_data = {'content': 'Test message from Python', 'priority': 'normal'}
        message = self.client.create_message('test_queue', test_data)

        self.assertIn('id', message)
        self.assertIn('timestamp', message)
        self.assertEqual(message['data'], test_data)
        self.assertEqual(message['status'], 'created')

    def test_get_messages(self):
        # First create a test message
        test_data = {'content': 'Python test message for retrieval', 'priority': 'high'}
        self.client.create_message('test_queue', test_data)

        messages = self.client.get_messages('test_queue')

        self.assertIsInstance(messages, list)
        self.assertGreaterEqual(len(messages), 1)

        if messages:
            message = messages[0]
            self.assertIn('id', message)
            self.assertIn('data', message)
            self.assertIn('status', message)

    def test_update_message(self):
        # Create a test message
        original_data = {'content': 'Original Python content', 'priority': 'normal'}
        created_message = self.client.create_message('test_queue', original_data)

        # Update the message
        new_data = {'content': 'Updated Python content', 'priority': 'high'}
        update_result = self.client.update_message('test_queue', created_message['id'], new_data)

        self.assertTrue(update_result)

    def test_delete_message(self):
        # Create a test message
        test_data = {'content': 'Python message to delete', 'priority': 'normal'}
        created_message = self.client.create_message('test_queue', test_data)

        # Delete the message
        delete_result = self.client.delete_message('test_queue', created_message['id'])

        self.assertTrue(delete_result)

    def test_get_logs(self):
        logs = self.client.get_logs()

        self.assertIsInstance(logs, list)
        self.assertGreaterEqual(len(logs), 1)

        if logs:
            log = logs[0]
            self.assertIn('timestamp', log)
            self.assertIn('level', log)
            self.assertIn('message', log)
            self.assertIn('source', log)

    def test_error_handling(self):
        # Test with invalid queue name
        with self.assertRaises(Exception):
            self.client.create_message('', {'invalid': 'data'})

    @classmethod
    def tearDownClass(cls):
        # Clean up
        try:
            cls.client.delete_message('test_queue', 'dummy-id')
        except Exception:
            pass

if __name__ == '__main__':
    unittest.main()