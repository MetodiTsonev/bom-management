import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm
} from 'antd';
import axios from 'axios';

const TestExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Fetch expenses data
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      message.error('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'EXPENCE_ID',
      key: 'EXPENCE_ID',
    },
    {
      title: 'Expense Name',
      dataIndex: 'EXPENCE_NAME',
      key: 'EXPENCE_NAME',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this expense?"
            onConfirm={() => handleDelete(record.EXPENCE_ID)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await axios.put(`/api/expenses/${editingId}`, values);
        message.success('Expense updated successfully');
      } else {
        await axios.post('/api/expenses', values);
        message.success('Expense added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setEditingId(record.EXPENCE_ID);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      message.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setEditingId(null);
            form.resetFields();
          }}
        >
          Add New Expense
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="EXPENCE_ID"
      />

      <Modal
        title={editingId ? "Edit Expense" : "Add New Expense"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="EXPENCE_NAME"
            label="Expense Name"
            rules={[
              { required: true, message: 'Please input the expense name!' },
              { max: 20, message: 'Expense name cannot exceed 20 characters!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestExpenses;
