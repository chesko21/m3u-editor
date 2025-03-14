export interface Channel {
  extinf: string;
  name: string;
  logo: string;
  group: string;
  url: string;
  referer?: string;
  licenseType?: string;
  licenseKey?: string;
  tvgId?: string;
}


export function parseM3U(m3uContent: string): Channel[] {
  const lines = m3uContent.split("\n").map(line => line.trim());
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#EXTINF")) {
      currentChannel.extinf = line;
      const durationMatch = line.match(/^#EXTINF:(-?\d+)/);
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const groupMatch = line.match(/group-title="(.*?)"/);
      const tvgIdMatch = line.match(/tvg-id="(.*?)"/);

      currentChannel.duration = durationMatch ? durationMatch[1] : "-1";
      currentChannel.name = nameMatch ? nameMatch[1].trim() : "Unknown";
      currentChannel.logo = logoMatch ? logoMatch[1] : "";
      currentChannel.group = groupMatch ? groupMatch[1] : "Uncategorized";
      currentChannel.tvgId = tvgIdMatch ? tvgIdMatch[1] : "";
    }

    else if (line.startsWith("#KODIPROP:")) {
      const licenseTypeMatch = line.match(/license_type=(.*?)(?=$|[\r\n])/);
      const licenseKeyMatch = line.match(/license_key=(.*?)(?=$|[\r\n])/);
      if (licenseTypeMatch) currentChannel.licenseType = licenseTypeMatch[1].trim();
      if (licenseKeyMatch) currentChannel.licenseKey = licenseKeyMatch[1].trim();
    }

    else if (line.startsWith("#EXTVLCOPT:")) {
      const refererMatch = line.match(/http-referrer=(.*?)(?=$|[\r\n])/);
      if (refererMatch) currentChannel.referer = refererMatch[1].trim();
    }

    else if (line.startsWith("http") && currentChannel.extinf) {
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
    const extinf = `#EXTINF:${channel.duration} tvg-id="${channel.tvgId}" tvg-logo="${channel.logo}" group-title="${channel.group}",${channel.name}`;
    m3uContent += `${extinf}\n`;
    if (channel.referer) m3uContent += `#EXTVLCOPT:http-referrer=${channel.referer}\n`;
    if (channel.licenseType) m3uContent += `#KODIPROP:inputstream.adaptive.license_type=${channel.licenseType}\n`;
    if (channel.licenseKey) m3uContent += `#KODIPROP:inputstream.adaptive.license_key=${channel.licenseKey}\n`;
    m3uContent += `${channel.url}\n\n`;
  });

  return m3uContent;
}