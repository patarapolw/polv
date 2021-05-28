---
title: My Xubuntu customization
date: 2020-09-16T00:00:00+07:00
tag:
  - linux
  - ubuntu
  - xfce
  - xubuntu
  - conky
category:
  - linux
---

*Updated 2021-05-28*

Most major things here have to be [rEFInd](http://www.rodsbooks.com/refind/installing.html), [conky](http://ubuntuhandbook.org/index.php/2020/07/install-conky-manager-ubuntu-20-04-lts/) and [libinput-gestures](https://github.com/bulletmark/libinput-gestures)

`rEFInd` for me is MacBook-specific, though. I install it on macOS's side.

<!-- excerpt_separator -->

## Conky

```lua
conky.config = {
	update_interval = 1,
	cpu_avg_samples = 2,
	net_avg_samples = 2,
	out_to_console = false,
	override_utf8_locale = true,
	double_buffer = true,
	no_buffers = true,
	text_buffer_size = 32768,
	imlib_cache_size = 0,
	own_window = true,
	own_window_type = 'normal',
	own_window_argb_visual = true,
	-- own_window_argb_value = 50,
	own_window_transparent = true,
	own_window_hints = 'undecorated,below,sticky,skip_taskbar,skip_pager',
	border_inner_margin = 5,
	border_outer_margin = 0,
	xinerama_head = 1,
	alignment = 'bottom_right',
	gap_x = 20,
	gap_y = 20,
	draw_shades = false,
	draw_outline = false,
	draw_borders = false,
	draw_graph_borders = true,
	use_xft = true,
	font = 'Ubuntu Mono:size=12',
	xftalpha = 0.8,
	uppercase = false,
	default_color = 'white',
	own_window_colour = '#000000',
	minimum_width = 300, minimum_height = 0,
	alignment = 'top_right'
};
conky.text = [[
${alignr}${time %H:%M:%S}
${voffset -16}${font sans-serif:bold:size=18}${alignc}${time %H:%M}${font}
${voffset 4}${alignc}${time %A %B %d, %Y}
${font}${voffset -4}
${font sans-serif:bold:size=10}SYSTEM ${hr 2}
${font sans-serif:normal:size=8}$sysname $kernel $alignr $machine
Host:$alignr$nodename
Uptime:$alignr$uptime
Battery: ${execi 1000 cat /sys/class/power_supply/BAT0/status}${alignr}${battery_percent BAT0}% ${battery_bar 8,70 BAT0}

${font sans-serif:bold:size=10}CPU ${hr 2}
${font sans-serif:normal:size=8}${execi 1000 grep model /proc/cpuinfo | cut -d : -f2 | tail -1 | sed 's/\s//'}

${alignr} Total CPU: ${cpu cpu0}%
${cpugraph cpu0 50,300 -t}
CPU1: ${cpu cpu1}% ${alignr}${cpubar cpu1 6,240}
CPU2: ${cpu cpu2}% ${alignr}${cpubar cpu2 6,240}
CPU3: ${cpu cpu3}% ${alignr}${cpubar cpu3 6,240}
CPU4: ${cpu cpu4}% ${alignr}${cpubar cpu4 6,240}
CPU5: ${cpu cpu5}% ${alignr}${cpubar cpu5 6,240}
CPU6: ${cpu cpu6}% ${alignr}${cpubar cpu6 6,240}
CPU7: ${cpu cpu7}% ${alignr}${cpubar cpu7 6,240}
CPU8: ${cpu cpu8}% ${alignr}${cpubar cpu8 6,240}

${font sans-serif:bold:size=10}MEMORY ${hr 2}
${font sans-serif:normal:size=8}RAM $alignc $mem / $memmax $alignr $memperc%
$membar
SWAP $alignc ${swap} / ${swapmax} $alignr ${swapperc}%
${swapbar}

${memgraph 50,300 -t}

${font sans-serif:bold:size=10}DISK USAGE ${hr 2}
${font sans-serif:normal:size=8}/ $alignc ${fs_used /} / ${fs_size /} $alignr ${fs_used_perc /}%
${fs_bar /}

${font Ubuntu:bold:size=10}NETWORK ${hr 2}
${font sans-serif:normal:size=8}Local IPs:${alignr}External IP:
${execi 1000 ip a | grep inet | grep -vw lo | grep -v inet6 | cut -d \/ -f1 | sed 's/[^0-9\.]*//g'}  ${alignr}${execi 60000  wget -q -O- http://ipecho.net/plain; echo}
${font sans-serif:normal:size=8}Down: ${downspeed wlp2s0}  ${alignr}Up: ${upspeed wlp1s0} 
${color lightgray}${downspeedgraph wlp2s0 30,145} ${alignr}${upspeedgraph wlp1s0 30,145}$color
${font sans-serif:bold:size=10}TOP PROCESSES ${hr 2}
${font sans-serif:normal:size=8}Name $alignr PID   CPU%   MEM%${font sans-serif:normal:size=8}
${top name 1} $alignr ${top pid 1} ${top cpu 1}% ${top mem 1}%
${top name 2} $alignr ${top pid 2} ${top cpu 2}% ${top mem 2}%
${top name 3} $alignr ${top pid 3} ${top cpu 3}% ${top mem 3}%
${top name 4} $alignr ${top pid 4} ${top cpu 4}% ${top mem 4}%
${top name 5} $alignr ${top pid 5} ${top cpu 5}% ${top mem 5}%
${top name 6} $alignr ${top pid 6} ${top cpu 6}% ${top mem 6}%
${top name 7} $alignr ${top pid 7} ${top cpu 7}% ${top mem 7}%
${top name 8} $alignr ${top pid 8} ${top cpu 8}% ${top mem 8}%
${top name 9} $alignr ${top pid 9} ${top cpu 9}% ${top mem 9}%
${top name 10} $alignr ${top pid 10} ${top cpu 10}% ${top mem 10}%
]];
```

<center data-markdown>

![conky-screenshot](https://res.cloudinary.com/patarapolw/image/upload/v1622172960/polv/2021-05-28_10-35_mchgls.png)

</center>

## libinput-gestures

As the author targeted GNOME-3 desktop (but I prefer Xfce, and sometimes, MATE), this has to be tweaked a little.

```sh
cp /etc/libinput-gestures.conf ~/.config/libinput-gestures.conf
code ~/.config/libinput-gestures.conf
```

```conf
gesture swipe left	_internal ws_left
gesture swipe right	_internal ws_right
```
