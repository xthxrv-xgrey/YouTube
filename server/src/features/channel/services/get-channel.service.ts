import ApiError from "#core/errors/ApiError.ts";
import ChannelModel from "../models/channel.model";

export const getChannel = async (handle: string) => {
  const channel = await ChannelModel.findOne({ handle });
  if (!channel) throw new ApiError(400, "Channel Not Found");

  return channel;
};
