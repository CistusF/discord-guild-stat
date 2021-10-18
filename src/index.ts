import { Client, Collection, DMChannel, GuildChannel, GuildMember, PartialGuildMember, ThreadChannel } from 'discord.js';
import config from './config';

const client = new Client({
    intents: ["GUILD_MEMBERS"]
});

const memberUpdate = (channelName: string, bot: boolean, member: GuildMember | PartialGuildMember) => {
    let category = member.guild.channels.cache.find(i => i.name.toLocaleLowerCase() === "guild_stat");
    if (!category || category.type !== "GUILD_CATEGORY") return;
    let channels = member.guild.channels.cache.filter(i => i.parentId === category!.id);
    channels.find(i => i.name.toLocaleLowerCase().includes(channelName))?.setName(bot ? "bot" : "member" + "_count : " + member.guild.members.cache.filter(i => !i.user.bot).size, bot ? "Bot" : "Member" + " Logging")
};

const channelUpdate = (channel: GuildChannel | DMChannel) => {
    channel = channel as GuildChannel;
    let category = channel.guild.channels.cache.find(i => i.name.toLocaleLowerCase() === "guild_stat");
    if (!category || category.type !== "GUILD_CATEGORY") return;
    let channels = channel.guild.channels.cache.filter(i => i.parentId === category!.id);
    channels.find(i => i.name.toLocaleLowerCase().includes("channel_count"))?.setName("channel_count : " + channel.guild.channels.cache.size, "channel size Logging");
};

client.on("guildMemberAdd", (member: GuildMember) => {
    memberUpdate("member_count", false, member);
    memberUpdate("bot_count", true, member);
});

client.on("guildMemberRemove", (member: GuildMember | PartialGuildMember) => {
    memberUpdate("member_count", false, member);
    memberUpdate("bot_count", true, member);
});

client.on("channelCreate", (channel: GuildChannel) => {
    channelUpdate(channel)
});

client.on("channelDelete", (channel: GuildChannel | DMChannel) => {
    channelUpdate(channel)
});

client.login(config.token);