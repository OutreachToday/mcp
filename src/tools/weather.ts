import { z } from 'zod';
import { BaseTool } from '../utils/base-tool.js';

const USER_AGENT = 'weather-app/1.0';

async function makeNWSRequest<T>(url: string): Promise<T | null> {
    const headers = {
        'User-Agent': USER_AGENT,
        Accept: 'application/geo+json',
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        console.error('Error making NWS request:', error);
        return null;
    }
}

interface AlertFeature {
    properties: {
        event?: string;
        areaDesc?: string;
        severity?: string;
        status?: string;
        headline?: string;
    };
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
    const props = feature.properties;
    return [
        `Event: ${props.event || 'Unknown'}`,
        `Area: ${props.areaDesc || 'Unknown'}`,
        `Severity: ${props.severity || 'Unknown'}`,
        `Status: ${props.status || 'Unknown'}`,
        `Headline: ${props.headline || 'No headline'}`,
        '---',
    ].join('\n');
}

interface AlertsResponse {
    features: AlertFeature[];
}

const NWS_API_BASE = 'https://api.weather.gov';

export class WeatherTool extends BaseTool {
    name = 'weather';
    description = 'Get the weather for a given location';
    parameters = z.object({
        location: z.string(),
    });
    schema = z.object({
        state: z
            .string()
            .length(2)
            .describe('Two-letter state code (e.g. CA, NY)'),
    });
    async execute({ state }: z.infer<typeof this.schema>) {
        try {
            const stateCode = state.toUpperCase();
            const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
            const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

            if (!alertsData) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: 'Failed to retrieve alerts data',
                        },
                    ],
                };
            }

            const features = alertsData.features || [];
            if (features.length === 0) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `No active alerts for ${stateCode}`,
                        },
                    ],
                };
            }

            const formattedAlerts = features.map(formatAlert);
            const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join(
                '\n'
            )}`;

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: alertsText,
                    },
                ],
            };
        } catch (error) {
            console.error('Error executing tool', error);
            throw error;
        }
    }
}
