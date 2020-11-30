---
title: Windows equivalent of Conky - DesktopInfo
date: 2020-11-30
tag:
  - windows
  - conky
  - desktopinfo
  - widget
---

Luckily, Windows has a worthy equivalent of [Conky](https://github.com/brndnmtthws/conky), [DesktopInfo](https://www.glenn.delahoy.com/desktopinfo/).

<%- xCard({
  href: 'https://www.glenn.delahoy.com/desktopinfo/',
  image: 'https://www.glenn.delahoy.com/wp-content/uploads/2020/04/logo.png',
  title: 'Desktop Info - Real Time System Information At Your Fingertips',
  description: 'This little application displays real time system information on your desktop. Perfect for quick identification, walk-by monitoring and simple remote monitoring of production servers, test farms or any computer you’re responsible for. Uses little memory and low cpu. Everything is customisable including language.'
}) %>

Which is much much better than Widget Launcher, where you can find in Windows Store, if you go by the keyword "widget".

<!-- excerpt -->

First, I extracted `DesktopInfo290.zip` to `C:\DesktopInfo290`.

Then I create a Shortcut to `C:\DesktopInfo290\DesktopInfo.exe` at `shell:startup` (Copy; then type `shell:startup` at the Location bar; then Paste Shortcut). Despite having 64-bit Windows, `DesktopInfo64.exe` does not visibly run.

My widget settings `desktopinfo.ini` is this, where I edited `desktopinfo-advanced.ini`.

```ini
# page 1 date/time
PAGE=1
PAGE-TITLE=Home Page
COLOR=%Cyan%

COMMENT=color:%white%,style:w,font-face:BahnSchrift,font-size:140%,text:Desktop Info
CMD=text:Time,interval:60,code-page:65001,file:python.exe,parameters:get_tz_datetime.py,display:%4
TIMEZONE=interval:60
UPTIME=interval:60,display:%1 d %2 h %3 min
WMI=interval:60,text:Battery,namespace:root\cimv2,query:WIn32_Battery,display:%EstimatedChargeRemaining%% (%battery%BatteryStatus%%)
HOST
USER
HTTPGET=interval:600,text:External IP,source:http://ipecho.net/plain
NETPACKETS=interval:5,display:Down: %1[9.0n]    Up: %2[9.0n]
NETPACKETSRATE=interval:3,chart:line2 height:3 scale:log max:25 series1:1 color1:%yellow% series2:2 color2:%blue%,display:Down:%1[5.1b]Bps       Up:%2[5.1b]Bps
CONTROL=type:1,color:%white%,text:,display:Network Connections,uri:%SystemRoot%\System32\control.exe,args:ncpa.cpl

# page 1 - cpu
WMI=interval:5,id:temp,hide-no-result:1,text:Cpu Temp,namespace:root\wmi,query:MSAcpi_ThermalZoneTemperature,display: {{1.0f:%CurrentTemperature%/10-273.15}}C / {{1.0f:%CriticalTripPoint%/10-273.15}}C
CPU=interval:3,chart:line2 height:3 scale:linear max:100 series1:1 color1:00ff00 series2:2 color2:bb00bb,threshold1:1 80 %red%,threshold2:2 40 %red%,display:Total: %1[2.0f]%\, Kernel: %2[2.0f]%\, Queue: %3
CPUUSAGE=interval:1,font-size:8,row-text:Cpu %1,chart:line2 scale:linear max:100 series1:2 color1:00ff00 row-id:1,threshold1:2 80,display:%2[2.0d]% %chart%
PROCESSCOUNT=interval:5,display:%1 processes\, %2 threads
TOPPROCESSCPU=interval:5,maxrows:5,display:%1 (pid:%2) %3%

COLOR=b0ffb0

# page 1 - memory
COMMENT=text:,font-size:50%
PHYSICALRAM=interval:3,chart:line2 height:3 scale:linear max:100 series1:3 color1:00ff00,threshold1:3 80 %red%,display:%1[3.1b]B / %2[3.1b]B (%3% used)
TOPPROCESSMEM=interval:10,font-size:80%,text:Top Memory,display:%1 (pid:%2) %3[1.1b]B
PAGEFAULTS=interval:10,font-size:100%,threshold1:5 -80 2222bb,display:Total: %1[1.0n]\, Ratio: %2\, Hit: %5%

COLOR=%Orange%

# page 1 - network
COMMENT=text:,font-size:50%
WMI=interval:3,id:wifi,hide-no-result:1,font-size:80%,chart:line2 scale:log max:23 series1:1 color1:00ff00 series2:2 color2:bb00bb,threshold1:1 {{%CurrentBandwidth%/8*95/100}} 2222ee,threshold2:2 {{%CurrentBandwidth%/8*95/100}} #ff0000,text:Wifi Traffic,namespace:root\cimv2,query:Win32_PerfFormattedData_Tcpip_NetworkInterface where Name like "%Atheros AR9285%",display:R: %BytesReceivedPersec%[3.1b]Bps\, S: %BytesSentPersec%[3.1b]Bps\, B: {{1.0B:%CurrentBandwidth%/8}}Bps,id:wifi1
WMI=interval:3,id:eth, hide-no-result:1,font-size:80%,chart:line2 scale:log max:23 series1:1 color1:00ff00 series2:2 color2:bb00bb,threshold1:1 {{%CurrentBandwidth%/8*95/100}} 2222ee,threshold2:2 {{%CurrentBandwidth%/8*95/100}} 0000ff,text:Ethernet Traffic,namespace:root\cimv2,query:Win32_PerfFormattedData_Tcpip_NetworkInterface where Name like "%Ethernet%" and CurrentBandwidth>0,display:R: %BytesReceivedPersec%[3.1b]Bps\, S: %BytesSentPersec%[3.1b]Bps\, B: {{1.0B:%CurrentBandwidth%/8}}Bps

COLOR=%Silver%

# page 1 - disks
COMMENT=text:,font-size:50%
LOGICALDRIVES=interval:5,diskio:1,font-size:85%,chart:bar2 scale:linear max:100 series1:7 threshold:75,threshold1:11 10000000 0000f0,threshold2:13 10000000,threshold3:7 90 0070f0, 0060f0,row-text:Drive %1: (%2)| %3,display:%6[1.0B]B / %5[1.0B]B (%7[1.1f]% used)|%chart%| r: %11[1.1B]B/s\, w: %13[1.1B]B/s\, q: %17\, i: %19%| avg read: %15[1.3B]secs\, write: %16[1.3B]secs
```

And, the associated Python script, `get_tz_datetime.py`, is

```python
from datetime import datetime, timezone, time

print(datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %z"))
```

## End result

![desktopinfo-output](https://dev-to-uploads.s3.amazonaws.com/i/pmngq6yep91sfgybpw18.jpg)
