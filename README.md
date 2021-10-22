# pxt-dfrobot_asr

[这是一款离线语音识别模块](https://www.dfrobot.com.cn/goods-3011.html)

> 在 [https://qsjhyy.github.io/pxt-dfrobot_asr](https://github.com/DFRobot/pxt-dfrobot_asr) 打开此页面

## Expand

此仓库可以作为 **插件** 添加到 MakeCode 中。

* 打开 [https://makecode.microbit.org/](https://makecode.microbit.org/)
* 点击 **新项目**
* 点击齿轮图标菜单下的 **扩展**
* 搜索 **https://github.com/qsjhyy/pxt-dfrobot_asr** 并导入

## Edit this project ![Build status flag](https://github.com/qsjhyy/pxt-dfrobot_asr/workflows/MakeCode/badge.svg)

在 MakeCode 中编辑此仓库。

* 打开 [https://makecode.microbit.org/](https://makecode.microbit.org/)
* 点击 **导入**，然后点击 **导入 URL**
* 粘贴 **https://github.com/DFRobot/pxt-dfrobot_asr** 并点击导入

## Basic usage

```blocks

    /**
     * TODO: The speech recognition module is initialized. Procedure
     * @param e1 recognition mode
     * @param e2 microphone mode
     * @return Returns true on initialization success false on failure
     */
    ASR.begin(enum1: ModeEnum, enum2: MicrophoneModeEnum)

    /**
     * TODO: Voice module starts recognition
     */
    ASR.start()

    /**
     * TODO:  Add entries to modules
     * @param words  A string representing an entry
     * @param idNum  The identification number of the entry
     * @return bool值 Returns true on success, false on failure
     */
    ASR.addCommand(words: string, idNum: number)

    /**
     * TODO: Read the identified entry
     * @return Returns the identification number representing the entry
     */
    ASR.read()

    /**
     * TODO: Set the I2C address of the module (take effect after the power failure and restart)
     * @param addr  I2c ADDRESS to be set (0 to 127)
     */
    ASR.setI2CAddr(addr: number)

```

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](.github/makecode/blocksdiff.png)

## Metadata (for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

## License

MIT

Copyright (c) 2018, microbit/micropython Chinese community  


## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
