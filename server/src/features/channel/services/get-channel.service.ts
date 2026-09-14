import ApiError from "#core/errors/ApiError.js";
import ChannelModel from "../models/channel.model.js";

export const getChannel = async (handle: string) => {
  const channel = await ChannelModel.findOne({ handle });
  if (!channel) throw new ApiError(404, "Channel Not Found");

  return channel;
};
