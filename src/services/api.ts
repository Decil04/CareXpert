import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Configure the base API URL based on the environment.
 * - Web: localhost
 * - Mobile: Dynamically retrieves the IP address from Expo Constants to work on physical devices!
 */
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : '192.168.16.136'; // Fallback IP

const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3001/api' 
  : `http://${localhost}:3001/api`;

/**
 * Sends a medical document to the backend for analysis.
 * Handles both Web and Mobile FormData requirements.
 */
export const analyseDocument = async (
  uri: string, 
  name: string, 
  type: string, 
  age?: string, 
  language: string = 'en'
) => {
  const formData = new FormData();
  
  // React Native requires a specific object structure for files in FormData
  const fileData: any = {
    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    name: name || 'document.pdf',
    type: type || 'application/pdf',
  };

  // On Web, we can just use the proxy object or a blob
  if (Platform.OS === 'web') {
    // If it's a web URI (blob), we might need to fetch it or pass as is
    // But usually in Web, 'uri' is already a blob/file reference from the input
    formData.append('document', fileData.uri);
  } else {
    formData.append('document', fileData);
  }

  const response = await axios.post(`${API_BASE_URL}/analyse`, formData, {
    params: { age, language },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // Ensure timeout for AI processing
    timeout: 60000, 
  });

  return response.data;
};

/**
 * Fetches the most recent analysis results from the backend.
 */
export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};

/**
 * Sends raw medical text to the backend for AI analysis.
 */
export const analyseRawText = async (text: string, age?: string, language: string = 'en') => {
  const response = await axios.post(`${API_BASE_URL}/analyse/text`, { text }, {
    params: { age, language },
    timeout: 60000, 
  });
  return response.data;
};
