
import { DatabaseConnection } from "@/types/database";

export const mockDatabases: DatabaseConnection[] = [
  {
    id: "db1",
    name: "Production Database",
    type: "postgres",
    threads: [
      {
        id: "thread1",
        name: "Daily Active Users Query",
        lastMessage: "Show me the daily active users for the last week",
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: "thread2",
        name: "Revenue Analysis",
        lastMessage: "What's our revenue trend for Q1?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ]
  },
  {
    id: "db2",
    name: "Analytics Database",
    type: "mysql",
    threads: [
      {
        id: "thread3",
        name: "Event Tracking",
        lastMessage: "Show me conversion rates for our signup flow",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    ]
  },
  {
    id: "db3",
    name: "User Database",
    type: "mongodb",
    threads: [
      {
        id: "thread4",
        name: "User Demographics",
        lastMessage: "What's the age distribution of our users?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
      },
      {
        id: "thread5",
        name: "Subscription Analysis",
        lastMessage: "How many users are on the pro plan?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
      },
      {
        id: "thread6",
        name: "Churn Investigation",
        lastMessage: "What's our monthly churn rate?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
      }
    ]
  }
];
