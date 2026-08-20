import { AiRouteEntity, ApiKeyEntity, RouteAttemptRecord, RoutePingResult } from '../types';
import { decryptKey } from './security';

export class AiRouter {
  async pingRoute(route: AiRouteEntity, apiKey?: ApiKeyEntity | null): Promise<RoutePingResult> {
    const startTime = performance.now();

    // Check if key is available if required
    if (route.provider !== 'custom' && (!apiKey || apiKey.status !== 'ACTIVE')) {
      return {
        routeId: route.id,
        isSuccess: false,
        latencyMs: 45,
        statusCode: 401,
        errorMessage: `API key for ${route.provider.toUpperCase()} is missing or revoked`
      };
    }

    // Simulate realistic network roundtrip
    const baseLatency = route.provider === 'groq' ? 65 : route.provider === 'nvidia' ? 140 : 220;
    const jitter = Math.floor(Math.random() * 50);
    const latencyMs = baseLatency + jitter;

    // Simulate occasional key status issues or successful response
    if (apiKey?.status === 'RATE_LIMITED') {
      return {
        routeId: route.id,
        isSuccess: false,
        latencyMs,
        statusCode: 429,
        errorMessage: 'HTTP 429 Too Many Requests (Rate limit exceeded)'
      };
    }

    return {
      routeId: route.id,
      isSuccess: true,
      latencyMs,
      statusCode: 200,
      errorMessage: ''
    };
  }

  async routePromptWithFallback(
    prompt: string,
    routes: AiRouteEntity[],
    apiKeys: ApiKeyEntity[],
    triggerSimulatedFailure: boolean = false
  ): Promise<{
    response: string;
    routeUsed: AiRouteEntity;
    attempts: RouteAttemptRecord[];
  }> {
    const sortedRoutes = [...routes]
      .filter(r => r.isEnabled)
      .sort((a, b) => a.priority - b.priority);

    if (sortedRoutes.length === 0) {
      throw new Error('No enabled AI routes found. Please configure routes in the AI Routes panel.');
    }

    const attempts: RouteAttemptRecord[] = [];

    for (let i = 0; i < sortedRoutes.length; i++) {
      const route = sortedRoutes[i];
      const apiKey = apiKeys.find(k => k.id === route.apiKeyId);

      const isFirstAndFailing = triggerSimulatedFailure && i === 0;

      if (isFirstAndFailing) {
        attempts.push({
          routeId: route.id,
          routeName: route.name,
          provider: route.provider,
          modelId: route.modelId,
          isSuccess: false,
          statusCode: 429,
          latencyMs: 180,
          errorMessage: `HTTP 429 Rate Limit Exceeded on ${route.provider.toUpperCase()}. Auto-triggering failover to next route in chain...`
        });
        continue;
      }

      // Check key validity
      if (route.provider !== 'custom' && (!apiKey || apiKey.status !== 'ACTIVE')) {
        attempts.push({
          routeId: route.id,
          routeName: route.name,
          provider: route.provider,
          modelId: route.modelId,
          isSuccess: false,
          statusCode: 401,
          latencyMs: 35,
          errorMessage: `Key for ${route.name} is missing or inactive. Attempting fallback...`
        });
        continue;
      }

      // Successful dispatch
      const latency = route.provider === 'groq' ? 85 : 280;
      attempts.push({
        routeId: route.id,
        routeName: route.name,
        provider: route.provider,
        modelId: route.modelId,
        isSuccess: true,
        statusCode: 200,
        latencyMs: latency,
        errorMessage: ''
      });

      return {
        response: `[Generated via ${route.name}]`,
        routeUsed: route,
        attempts
      };
    }

    throw new Error('All configured AI routes in the fallback chain failed.');
  }
}

export const aiRouter = new AiRouter();
