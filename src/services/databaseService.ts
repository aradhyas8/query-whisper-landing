
import { toast } from 'sonner';
import api from '../utils/api';
import axios from 'axios';

/**
 * Deletes a database connection
 * @param connectionId ID of the connection to delete
 * @returns Promise resolving to success or error
 */
export const deleteConnection = async (connectionId: string): Promise<boolean> => {
  try {
    await api.delete(`/api/connections/${connectionId}`);
    toast.success("Database connection removed successfully");
    return true;
  } catch (error) {
    console.error('Error deleting database connection:', error);
    let errorMessage = "Failed to delete database connection";
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
    return false;
  }
};
