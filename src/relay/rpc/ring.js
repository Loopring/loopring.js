import request, { id } from '../../common/request';
import validator from '../validator';
import Response from '../../common/response';
import code from '../../common/code';
import { toBig, toHex, clearHexPrefix} from '../../common/formatter';
import { getOrderHash } from './order';
import { soliditySHA3 } from 'ethereumjs-abi';

export default class Ring
{
    constructor (host)
    {
        this.host = host;
    }

    getRings (filter)
    {
        return getRings(this.host, filter);
    }

    getRingMinedDetail (filter)
    {
        return getRingMinedDetail(this.host, filter);
    }

    getFills (filter)
    {
        return getFills(this.host, filter);
    }

    getRingHash (orders, feeRecipient, feeSelections)
    {
        return getRingHash(orders, feeRecipient, feeSelections);
    }

    submitRingForP2P (filter)
    {
        return submitRingForP2P(this.host, filter);
    }
}

/**
 * @description Get all mined rings.
 * @param host
 * @param filter
 * @returns {Promise.<*>}
 */
export function getRings (host, filter)
{
    try
    {
        if (filter && filter.delegateAddress)
        {
            validator.validate({value: filter.delegateAddress, type: 'ETH_ADDRESS'});
        }

        if (filter && filter.pageIndex)
        {
            validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'});
        }
        if (filter && filter.pageSize)
        {
            validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'});
        }
    }
    catch (e)
    {
        return Promise.resolve(
            new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg));
    }
    const body = {};
    body.method = 'loopring_getRingMined';
    body.params = [{...filter}];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
        method: 'post',
        body
    });
}

/**
 * @description Get ring mined detail
 * @param host
 * @param filter
 * @returns {Promise}
 */
export function getRingMinedDetail (host, filter)
{
    let {ringIndex, delegateAddress} = filter;
    try
    {
        validator.validate({value: delegateAddress, type: 'ETH_ADDRESS'});
    }
    catch (e)
    {
        return Promise.resolve(
            new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg));
    }
    ringIndex = toHex(toBig(ringIndex));
    const body = {};
    body.method = 'loopring_getRingMinedDetail';
    body.params = [{...filter, ringIndex}];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
        method: 'post',
        body
    });
}

/**
 * @description Get order fill history. This history consists of OrderFilled events.
 * @param host
 * @param filter {market, owner, delegateAddress, orderHash, ringHash,pageIndex,pageSize}
 * @returns {Promise}
 */
export function getFills (host, filter)
{
    try
    {
        if (filter.delegateAddress)
        {
            validator.validate({value: filter.delegateAddress, type: 'ETH_ADDRESS'});
        }
        if (filter.owner)
        {
            validator.validate({value: filter.owner, type: 'ETH_ADDRESS'});
        }
        if (filter.orderHash)
        {
            validator.validate({value: filter.orderHash, type: 'HASH'});
        }
        if (filter.ringHash)
        {
            validator.validate({value: filter.ringHash, type: 'HASH'});
        }
        if (filter.pageIndex)
        {
            validator.validate({value: filter.pageIndex, type: 'OPTION_NUMBER'});
        }
        if (filter.pageSize)
        {
            validator.validate({value: filter.pageSize, type: 'OPTION_NUMBER'});
        }
    }
    catch (e)
    {
        return Promise.resolve(
            new Response(code.PARAM_INVALID.code, code.PARAM_INVALID.msg));
    }
    const body = {};
    body.method = 'loopring_getFills';
    body.params = [filter];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
        method: 'post',
        body
    });
}

export function getRingHash (orders, feeRecipient, feeSelections)
{
    const orderHashList = orders.map(order => toHex(getOrderHash(order)));
    return soliditySHA3(['string', 'address', 'uint16'], [
        xorReduceStr(orderHashList),
        feeRecipient,
        feeSelectionListToNumber(feeSelections)
    ]);
}

export function submitRingForP2P (host, filter)
{
    const {takerOrderHash, makerOrderHash} = filter;
    validator.validate({value: takerOrderHash, type: 'HASH'});
    validator.validate({value: makerOrderHash, type: 'HASH'});
    const body = {};
    body.method = 'loopring_submitRingForP2P';
    body.params = [filter];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
        method: 'post',
        body
    });
}

function xorReduceStr (strArr)
{
    const s0 = strArr[0];
    const tail = strArr.slice(1);
    const strXor = (s1, s2) =>
    {
        const buf1 = Buffer.from(s1.slice(2), 'hex');
        const buf2 = Buffer.from(s2.slice(2), 'hex');
        const res = Buffer.alloc(32);
        for (let i = 0; i < 32; i++)
        {
            res[i] = buf1[i] ^ buf2[i];
        }
        return toHex(res);
    };
    const reduceRes = tail.reduce((a, b) => strXor(a, b), s0);
    return Buffer.from(reduceRes.slice(2), 'hex');
}

export function feeSelectionListToNumber (feeSelections)
{
    let res = 0;
    for (let i = 0; i < feeSelections.length; i++)
    {
        res += feeSelections[i] << i;
    }

    return res;
}
