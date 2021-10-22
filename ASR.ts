/*!
 * @file ASR.ts
 * @brief DFRobot's ASR makecode library.
 * @details  This is a speech recognition module,
 * @n  [Get the module here](https://www.dfrobot.com.cn/goods-1802.html)
 * @copyright  Copyright (c) 2010 DFRobot Co.Ltd (http://www.dfrobot.com)
 * @license  The MIT License (MIT)
 * @author  [qsjhyy](yihuan.huang@dfrobot.com)
 * @version  V1.0
 * @date  2020-10-19
 */

// ASR Module IIC communication address
const ASR_ADDRESSS = 0x4F

/**
 * Only Chinese characters can be recognized. The characters to be recognized are converted into pinyin letters separated by Spaces, such as: Start --> Kai SHI
 * Add a maximum of 50 entries, each with a maximum of 72 characters and each entry with a maximum of 10 Chinese characters
 * Each term corresponds to an id (set arbitrarily from 1 to 255). Different phonetic terms can correspond to the same ID.
 */
const ASR_BEGIN          = 0xA1
const ASR_ADDCOMMAND     = 0xA2
const ASR_ADDCOMMAND_END = 0xA3
const ASR_START          = 0xA4
const ASR_LOOP           = 0xA5
const ASR_BUTTON         = 0xA7
const ASR_PASSWORD       = 0xA6
const ASR_IDLE           = 0xA8
const ASR_MIC_MODE       = 0xA9
const ASR_MONO_MODE      = 0xAA
const ASR_SET_IIC_ADDR   = 0xAB

/**
 * ASR blocks
 */
//% weight=100 color=#0fbcff block="ASR"
namespace ASR {
    let _mode: ModeEnum
    let idle = 0
    let commandBuf = pins.createBuffer(1)

    /**
     * @enum  ModeEnum
     * @brief 三种识别模式
     */
    export enum ModeEnum {
        //% block="LOOP"
        LOOP,
        //% block="PASSWORD"
        PASSWORD,
        //% block="BUTTON"
        BUTTON
    }

    /**
     * @enum  MicrophoneModeEnum
     * @brief  Mic Select
     */
    export enum MicrophoneModeEnum {
        //% block="MIC"
        MIC,
        //% block="MONO"
        MONO
    }

    /**
     * TODO: The speech recognition module is initialized. Procedure
     * @param e1 recognition mode
     * @param e2 microphone mode
     * @return Returns true on initialization success false on failure
     */
    //% blockId=begin block="begin ModeEnum %enum1 MicrophoneModeEnum %enum2"
    export function begin(enum1: ModeEnum, enum2: MicrophoneModeEnum): boolean {
        let ret = true
        _mode = enum1
        commandBuf[0] = ASR_BEGIN
        if(!writeReg(commandBuf))
            ret = false
        if (enum2 == MicrophoneModeEnum.MIC) {
            commandBuf[0] = ASR_MIC_MODE
            if (!writeReg(commandBuf))
                ret = false
        } else {
            commandBuf[0] = ASR_MONO_MODE
            if (!writeReg(commandBuf))
                ret = false
        }
        basic.pause(50)
        return ret
    }

    /**
     * TODO: Voice module starts recognition
     */
    //% blockId=start block="Start Speech Recognition"
    export function start(): void {
        writeValue(ASR_START)
        basic.pause(50)
    }

    /**
     * TODO:  Add entries to modules
     * @param words  A string representing an entry
     * @param idNum  The identification number of the entry
     * @return bool值 Returns true on success, false on failure
     */
    //% blockId=addCommand block="Add entries to modules|%words|The entry number is|%idNum"
    export function addCommand(words: string, idNum: number): boolean {
        let len = words.length, lenTemp, ret = true
        if (len > 72) 
            ret = false
        
        let buf1 = pins.createBuffer(3)
        buf1[0] = ASR_ADDCOMMAND
        buf1[1] = idNum
        buf1[2] = len
        if (!writeReg(buf1))
            ret = false

        while (len) {
            if (len > 28) {
                lenTemp = 28
            } else {
                lenTemp = len
            }
            let wordBuf = pins.createBuffer(lenTemp)
            for (let i = 0; i < lenTemp; i++) {
                wordBuf[i] = words.charCodeAt(i)
            }
            if (!writeReg(wordBuf))
                ret = false
            len -= lenTemp
            words.substr(lenTemp)
        }

        commandBuf[0] = ASR_ADDCOMMAND_END
        if (!writeReg(commandBuf))
            ret = false
        basic.pause(20)

        return ret
    }

    /**
     * TODO: Read the identified entry
     * @return Returns the identification number representing the entry
     */
    //% blockId=read block="Recognition of a voice acquisition number"
    export function read(): number {
        let result = 0xFF
        switch (_mode) {
            case ModeEnum.BUTTON:
                writeValue(ASR_BUTTON)
                basic.pause(18)
                result = readValue()
                break
            case ModeEnum.LOOP:
                writeValue(ASR_LOOP)
                basic.pause(18)
                result = readValue()
                break
            case ModeEnum.PASSWORD:
                writeValue(ASR_PASSWORD)
                basic.pause(18)
                result = readValue()
                break
            default: break
        }
        // serial.writeLine("result: " + result)

        if (_mode == ModeEnum.PASSWORD) {
            idle++
            if (idle >= 500) {
                writeValue(ASR_IDLE)
                idle = 0
            }
        }
        if (result == 0xff) {
            return -1
        }
        else {
            idle = 0
            return result
        }
    }

    /**
     * TODO: Set the I2C address of the module (take effect after the power failure and restart)
     * @param addr  I2c ADDRESS to be set (0 to 127)
     */
    //% blockId=setI2CAddr block="Set the I2C address of the module (take effect after the power failure and restart)|%addr"
    export function setI2CAddr(addr: number): boolean {
        let ret = true
        if (addr > 127)
            ret = false
        let buf = pins.createBuffer(3)
        buf[0] = ASR_SET_IIC_ADDR
        buf[1] = addr
        if(!writeReg(buf))
            ret = false
        return ret
    }


    /**
     * TODO: Write single data over the IIC bus
     * @param value The single data to be written
     */
    function writeValue(value: number): void {
        pins.i2cWriteNumber(ASR_ADDRESSS, value, NumberFormat.UInt8LE)
    }

    /**
     * TODO: Write register values through the IIC bus
     * @param buf To write data
     * @return Returns true on success and false on failure
     */
    function writeReg(buf: Buffer): boolean {
        let ret = false
        if (0 == pins.i2cWriteBuffer(ASR_ADDRESSS, buf)) {
            ret = true
        }
        return ret
    }

    /**
     * TODO: Read register values through the IIC bus
     * @return  To read a single piece of data
     */
    function readValue(): number {
        let ret = pins.i2cReadNumber(ASR_ADDRESSS, NumberFormat.UInt8LE)
        return ret
    }
}
