// lib/m3uParser.ts
export interface Channel {
  name: string;
  logo: string;
  group: string;
  url: string;
  referer?: string;
  licenseType?: string;
  licenseKey?: string;
}

export function parseM3U(m3uContent: string): Channel[] {
  const lines = m3uContent.split("\n").map(line => line.trim());
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#EXTINF")) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const groupMatch = line.match(/group-title="(.*?)"/);
      const refererMatch = line.match(/http-referer="(.*?)"/);
      const licenseTypeMatch = line.match(/license_type="(.*?)"/);
      const licenseKeyMatch = line.match(/license_key="(.*?)"/);

      currentChannel = {
        name: nameMatch ? nameMatch[1] : "Unknown",
        logo: logoMatch ? logoMatch[1] : "",
        group: groupMatch ? groupMatch[1] : "Uncategorized",
        referer: refererMatch ? refererMatch[1] : "",
        licenseType: licenseTypeMatch ? licenseTypeMatch[1] : "",
        licenseKey: licenseKeyMatch ? licenseKeyMatch[1] : "",
      };
    } else if (line.startsWith("http") && currentChannel.name) {
      currentChannel.url = line;
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  }

  return channels;
}

export function generateM3U(channels: Channel[]): string {
  let m3uContent = "#EXTM3U\n\n";

  channels.forEach(channel => {
    m3uContent += `#EXTINF:-1 tvg-logo="${channel.logo}" group-title="${channel.group}"`;
    
    if (channel.referer) m3uContent += ` http-referer="${channel.referer}"`;
    if (channel.licenseType) m3uContent += ` license_type="${channel.licenseType}"`;
    if (channel.licenseKey) m3uContent += ` license_key="${channel.licenseKey}"`;

    m3uContent += `,${channel.name}\n`;
    m3uContent += `${channel.url}\n\n`;
  });

  return m3uContent;
}