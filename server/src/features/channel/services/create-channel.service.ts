import ApiError from "#core/errors/ApiError.ts";
import { Types } from "mongoose";
import ChannelModel from "../models/channel.model";

interface CreateChannelInput {
  owner: Types.ObjectId;
  handle: string;
  name: string;
}

export const createChannel = async (input: CreateChannelInput) => {
  const { owner, handle, name } = input;

  const userAlreadyHasAChannel = await ChannelModel.findOne({ owner });
  if (userAlreadyHasAChannel)
    throw new ApiError(400, "User Already own a channel");

  const existingHandle = await ChannelModel.findOne({ handle });
  if (existingHandle) throw new ApiError(400, "Handle Already in use");

  const channel = await ChannelModel.create(input);

  return channel;
};
