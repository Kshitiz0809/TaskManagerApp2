import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, useColorScheme } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { todoAPI } from '../../api/todoAPI';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getAllTodos();
      if (response.success) {
        setTodos(response.data);
      }
    } catch (err: any) {
      setError('Failed to load todos. Make sure the backend server is running.');
      console.error('Load todos error:', err);
      Alert.alert('Error', 'Failed to load todos. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const addTodo = async () => {
    if (input.trim()) {
      try {
        const response = await todoAPI.createTodo(input.trim());
        if (response.success) {
          setTodos([response.data, ...todos]);
          setInput('');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to add todo');
        console.error('Add todo error:', err);
      }
    }
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async () => {
    if (editingId && editingText.trim()) {
      try {
        const response = await todoAPI.updateTodo(editingId, { text: editingText.trim() });
        if (response.success) {
          setTodos(todos.map(todo => todo.id === editingId ? response.data : todo));
          setEditingId(null);
          setEditingText('');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to update todo');
        console.error('Update todo error:', err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete todo');
      console.error('Delete todo error:', err);
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      const response = await todoAPI.updateTodo(todo.id, { completed: !todo.completed });
      if (response.success) {
        setTodos(todos.map(t => t.id === todo.id ? response.data : t));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update todo');
      console.error('Toggle complete error:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>To-Do List</ThemedText>
      
      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Button title="Retry" onPress={loadTodos} />
        </ThemedView>
      )}

      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#555' : '#ccc' }]}
        placeholder="Add a new to-do"
        placeholderTextColor={isDark ? '#999' : '#666'}
        value={input}
        onChangeText={setInput}
        editable={!loading}
      />
      <Button title="Add" onPress={addTodo} disabled={loading} />
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ThemedView style={[styles.todoItem, item.completed && styles.todoItemCompleted]}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={[styles.editInput, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#555' : '#ccc' }]}
                    value={editingText}
                    onChangeText={setEditingText}
                    placeholderTextColor={isDark ? '#999' : '#666'}
                  />
                  <TouchableOpacity onPress={saveEdit}>
                    <ThemedText style={styles.save}>Save</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelEdit}>
                    <ThemedText style={styles.cancel}>Cancel</ThemedText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => toggleComplete(item)} style={styles.checkboxContainer}>
                    <ThemedView style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                      {item.completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                    </ThemedView>
                  </TouchableOpacity>
                  <ThemedView style={styles.todoTextContainer}>
                    <TouchableOpacity onPress={() => startEdit(item.id, item.text)}>
                      <ThemedText style={item.completed && styles.completedText}>{item.text}</ThemedText>
                      {item.created_at && (
                        <ThemedText style={styles.timestamp}>
                          {new Date(item.created_at).toLocaleString()}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  </ThemedView>
                  <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                    <ThemedText style={styles.delete}>Delete</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#c62828',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoItemCompleted: {
    backgroundColor: '#f0f0f0',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  todoText: {
    flex: 1,
  },
  todoTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginRight: 10,
  },
  save: {
    color: 'green',
    marginRight: 10,
  },
  cancel: {
    color: 'orange',
    marginRight: 10,
  },
  delete: {
    color: 'red',
  },
});
