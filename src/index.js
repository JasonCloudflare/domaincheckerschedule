export default {
  async scheduled(controller, env, ctx) {
    const zoneId = '{zoneID}'; // Replace with your zone ID
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`, {
      headers: {
        'Authorization': 'Bearer {api_token}', // Replace with your API token
        'Content-Type': 'application/json',
      },
    });

    const { result } = await response.json();
    
    for (const { hostname } of result) {
      const checkResponse = await fetch(`https://apitest.jasonlin.space/?q=${hostname}`);
      const checkResult = await checkResponse.json();
      
      await env.domain_blocklist.put(hostname, checkResult.code === '0000' ? 'true' : 'false');
    }
  },
};