import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import apiConfig from "../../../config/api";

export interface ShortenRequestPayload {
  original_url: string;
  slug?: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
}

export interface ShortenResponse {
  id: string;
  original_url: string;
  short_url: string;
  slug: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
  createdAt: string;
}

export interface ClickLog {
  id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AnalyticsResponse {
  url: {
    id: string;
    original_url: string;
    slug: string;
    expiration_date: string | null;
    utm_params: Record<string, string> | null;
    click_count: number;
    expired_access_count: number;
    createdAt: string;
  } | null;
  clicks: ClickLog[];
  isExpired: boolean;
}

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

  /**
   * Create a shortened URL
   * POST /api/shorten
   */
  async createShortenedUrl(
    payload: ShortenRequestPayload,
  ): Promise<ShortenResponse | null> {
    try {
      const response = await this.axiosInstance.post<ShortenResponse>(
        "/api/shorten",
        payload,
      );

      toast.success("URL shortened successfully!", {
        style: {
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #86efac",
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to shorten URL. Please try again.";

      toast.error(errorMessage, {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        },
      });
      console.error("Error creating shortened URL:", error);
      return null;
    }
  }

  /**
   * Get analytics for a shortened URL
   * GET /api/analytics/:slug
   */
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

      toast.error(errorMessage, {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        },
      });
      console.error("Error fetching analytics:", error);
      return null;
    }
  }
}

const urlService = new UrlService();

export default urlService;
