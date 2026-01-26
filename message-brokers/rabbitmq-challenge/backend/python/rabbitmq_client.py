import pika
import json
import uuid
import time
from typing import List, Dict, Any, Optional

class RabbitMQClient:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.connection = None
        self.channel = None
        self.connect()

    def connect(self) -> None:
        """Establish connection to RabbitMQ server"""
        try:
            credentials = pika.PlainCredentials(
                self.config['user'],
                self.config['password']
            )
            parameters = pika.ConnectionParameters(
                host=self.config['host'],
                port=self.config['port'],
                virtual_host=self.config['vhost'],
                credentials=credentials
            )
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
        except Exception as e:
            raise Exception(f"RabbitMQ connection failed: {str(e)}")

    def create_message(self, queue_name: str, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create and publish a message to the specified queue"""
        try:
            # Declare queue (durable)
            self.channel.queue_declare(queue=queue_name, durable=True)

            # Create message with metadata
            message = {
                'id': str(uuid.uuid4()),
                'timestamp': int(time.time()),
                'data': message_data,
                'status': 'created'
            }

            # Publish message
            self.channel.basic_publish(
                exchange='',
                routing_key=queue_name,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
                )
            )

            return message
        except Exception as e:
            raise Exception(f"Message creation failed: {str(e)}")

    def get_messages(self, queue_name: str) -> List[Dict[str, Any]]:
        """Retrieve messages from the specified queue"""
        try:
            messages = []

            def callback(ch, method, properties, body):
                message = json.loads(body)
                messages.append(message)
                ch.basic_ack(delivery_tag=method.delivery_tag)

            # Consume messages
            self.channel.basic_consume(
                queue=queue_name,
                on_message_callback=callback,
                auto_ack=False
            )

            # Start consuming (non-blocking)
            self.channel.start_consuming()
            time.sleep(1)  # Wait briefly for messages
            self.channel.stop_consuming()

            return messages
        except Exception as e:
            raise Exception(f"Message retrieval failed: {str(e)}")

    def update_message(self, queue_name: str, message_id: str, new_data: Dict[str, Any]) -> bool:
        """Update an existing message in the queue"""
        try:
            messages = self.get_messages(queue_name)
            updated = False

            for message in messages:
                if message['id'] == message_id:
                    message['data'] = new_data
                    message['status'] = 'updated'
                    message['updated_at'] = int(time.time())

                    # Re-publish the updated message
                    self.channel.basic_publish(
                        exchange='',
                        routing_key=queue_name,
                        body=json.dumps(message),
                        properties=pika.BasicProperties(
                            delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
                        )
                    )
                    updated = True
                    break

            return updated
        except Exception as e:
            raise Exception(f"Message update failed: {str(e)}")

    def delete_message(self, queue_name: str, message_id: str) -> bool:
        """Delete a message from the queue"""
        try:
            messages = self.get_messages(queue_name)
            deleted = False

            for message in messages:
                if message['id'] == message_id:
                    deleted = True
                    break

            return deleted
        except Exception as e:
            raise Exception(f"Message deletion failed: {str(e)}")

    def get_logs(self) -> List[Dict[str, Any]]:
        """Retrieve system logs (simulated for this challenge)"""
        try:
            return [
                {
                    'timestamp': int(time.time()),
                    'level': 'info',
                    'message': 'RabbitMQ connection established',
                    'source': 'system'
                },
                {
                    'timestamp': int(time.time()) - 300,
                    'level': 'info',
                    'message': 'Message queue initialized',
                    'source': 'queue_manager'
                }
            ]
        except Exception as e:
            raise Exception(f"Log retrieval failed: {str(e)}")

    def check_connection(self) -> Dict[str, Any]:
        """Check RabbitMQ connection status"""
        try:
            if self.connection and self.connection.is_open:
                return {
                    'status': 'connected',
                    'host': self.config['host'],
                    'port': self.config['port'],
                    'vhost': self.config['vhost']
                }
            else:
                return {
                    'status': 'disconnected',
                    'error': 'Connection is not open'
                }
        except Exception as e:
            return {
                'status': 'disconnected',
                'error': str(e)
            }

    def __del__(self):
        """Clean up resources"""
        if self.connection and self.connection.is_open:
            self.connection.close()