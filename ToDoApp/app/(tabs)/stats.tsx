import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions, ActivityIndicator, RefreshControl, useColorScheme } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { todoAPI } from '../../api/todoAPI';

interface DailyStats {
  date: string;
  day_name: string;
  completed: number;
  pending: number;
  total: number;
}

interface OverallStats {
  total_todos: number;
  completed_todos: number;
  pending_todos: number;
  today_todos: number;
  today_completed: number;
}

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getStats();
      if (response.success) {
        setDailyStats(response.dailyStats);
        setOverall(response.overall);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    backgroundGradientFrom: isDark ? '#2c2c2c' : '#4c669f',
    backgroundGradientTo: isDark ? '#1a1a1a' : '#3b5998',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
      </ThemedView>
    );
  }

  const completionRate = overall && overall.total_todos > 0
    ? overall.completed_todos / overall.total_todos
    : 0;

  const todayCompletionRate = overall && overall.today_todos > 0
    ? overall.today_completed / overall.today_todos
    : 0;

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>📊 Your Progress</ThemedText>

        {/* Overall Statistics Cards */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }]}>
            <ThemedText style={[styles.statNumber, { color: isDark ? '#fff' : '#333' }]}>{overall?.total_todos || 0}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Total Tasks</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }]}>
            <ThemedText style={[styles.statNumber, styles.completedColor]}>
              {overall?.completed_todos || 0}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Completed</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }]}>
            <ThemedText style={[styles.statNumber, styles.pendingColor]}>
              {overall?.pending_todos || 0}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Pending</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Today's Stats */}
        <ThemedView style={[styles.todayCard, { backgroundColor: isDark ? '#1e3a5f' : '#e3f2fd' }]}>
          <ThemedText style={[styles.todayTitle, { color: isDark ? '#64b5f6' : '#1976d2' }]}>📅 Today's Progress</ThemedText>
          <ThemedText style={[styles.todayStats, { color: isDark ? '#fff' : '#333' }]}>
            {overall?.today_completed || 0} of {overall?.today_todos || 0} tasks completed
          </ThemedText>
          {overall && overall.today_todos > 0 && (
            <ThemedText style={styles.todayPercentage}>
              {Math.round(todayCompletionRate * 100)}% Complete
            </ThemedText>
          )}
        </ThemedView>

        {/* Progress Chart */}
        {overall && overall.total_todos > 0 && (
          <ThemedView style={styles.chartContainer}>
            <ThemedText style={[styles.chartTitle, { color: isDark ? '#fff' : '#333' }]}>Overall Completion Rate</ThemedText>
            <ProgressChart
              data={{
                labels: ['Overall', 'Today'],
                data: [completionRate, todayCompletionRate],
              }}
              width={screenWidth - 40}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
              style={styles.chart}
            />
          </ThemedView>
        )}

        {/* Daily Tasks Bar Chart */}
        {dailyStats.length > 0 && (
          <ThemedView style={styles.chartContainer}>
            <ThemedText style={[styles.chartTitle, { color: isDark ? '#fff' : '#333' }]}>Last 7 Days - Tasks Created</ThemedText>
            <BarChart
              data={{
                labels: dailyStats.map(stat => stat.day_name),
                datasets: [
                  {
                    data: dailyStats.map(stat => stat.total),
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </ThemedView>
        )}

        {/* Daily Completed Tasks Line Chart */}
        {dailyStats.length > 0 && dailyStats.some(stat => stat.completed > 0) && (
          <ThemedView style={styles.chartContainer}>
            <ThemedText style={[styles.chartTitle, { color: isDark ? '#fff' : '#333' }]}>Last 7 Days - Completed Tasks</ThemedText>
            <LineChart
              data={{
                labels: dailyStats.map(stat => stat.day_name),
                datasets: [
                  {
                    data: dailyStats.map(stat => stat.completed),
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </ThemedView>
        )}

        {/* Daily Breakdown */}
        <ThemedView style={styles.breakdownContainer}>
          <ThemedText style={[styles.chartTitle, { color: isDark ? '#fff' : '#333' }]}>Daily Breakdown</ThemedText>
          {dailyStats.map((stat, index) => (
            <ThemedView key={index} style={[styles.breakdownRow, { 
              backgroundColor: isDark ? '#2c2c2c' : '#f9f9f9',
              borderLeftColor: isDark ? '#64b5f6' : '#3b5998'
            }]}>
              <ThemedText style={[styles.breakdownDate, { color: isDark ? '#fff' : '#333' }]}>
                {stat.day_name} ({new Date(stat.date).toLocaleDateString()})
              </ThemedText>
              <ThemedView style={styles.breakdownStats}>
                <ThemedText style={[styles.breakdownTotal, { color: isDark ? '#bbb' : '#666' }]}>Total: {stat.total}</ThemedText>
                <ThemedText style={styles.breakdownCompleted}>✓ {stat.completed}</ThemedText>
                <ThemedText style={styles.breakdownPending}>⏳ {stat.pending}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    marginTop: 50,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  completedColor: {
    color: '#4CAF50',
  },
  pendingColor: {
    color: '#FF9800',
  },
  todayCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  todayStats: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  todayPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  breakdownContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  breakdownRow: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b5998',
  },
  breakdownDate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  breakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownTotal: {
    fontSize: 14,
    color: '#666',
  },
  breakdownCompleted: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  breakdownPending: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
});
