import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import apiConfig from "../config/api";
import type {
  ShortenRequestPayload,
  ShortenResponse,
  AnalyticsResponse,
} from "../types/api.types";

// Re-export types for convenience
export type {
  ShortenRequestPayload,
  ShortenResponse,
  AnalyticsResponse,
  ClickLog,
  UrlDetails,
} from "../types/api.types";

const TOAST_STYLES = {
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },
} as const;

class UrlService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createShortenedUrl(
    payload: ShortenRequestPayload,
  ): Promise<ShortenResponse | null> {
    try {
      const response = await this.axiosInstance.post<ShortenResponse>(
        "/api/shorten",
        payload,
      );

      toast.success("URL shortened successfully!", {
        style: TOAST_STYLES.success,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to shorten URL. Please try again.";

      toast.error(errorMessage, { style: TOAST_STYLES.error });
      console.error("Error creating shortened URL:", error);
      return null;
    }
  }

  async getAnalytics(slug: string): Promise<AnalyticsResponse | null> {
    try {
      const response = await this.axiosInstance.get<AnalyticsResponse>(
        `/api/analytics/${slug}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to fetch analytics.";

      toast.error(errorMessage, { style: TOAST_STYLES.error });
      console.error("Error fetching analytics:", error);
      return null;
    }
  }
}

const urlService = new UrlService();

export default urlService;
