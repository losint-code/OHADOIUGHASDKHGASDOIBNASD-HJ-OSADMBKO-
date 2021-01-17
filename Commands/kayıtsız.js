const { MessageEmbed, Client, Message } = require("discord.js");
const Settings = require("../Settings/Settings.json")
module.exports.run = async (client, message, args) => {
  let cezarolu = Settings.Roles.Registerer
  if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(cezarolu)) return message.channel.send(new MessageEmbed().setAuthor("Yetersiz Yetki").setDescription(`**\`»\`** Bu komutu kullanabilmek için \`Admin\` veya \`Kayıt Sorumlusu\` yetkisine sahip olman gerekmekte.`).setColor(settings.colors.redColor)).then(x => x.delete({ timeout: 6500 }));

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!user) return message.channel.send("Kayıtsıza atmak için bir üye etiketlemelisin.")

user.setNickname(`${settings.serverSettings.serverTag} İsim | Yaş`)
user.roles.add(Settings.Roles.Unregister)
const embed = new MessageEmbed()
.setTitle("İşlem Başarılı")
.setDescription(`• ${user} üyesi başarıyla kayıtsıza atıldı.`)
.setColor(Settings.Colors.Green)
message.channel.send(embed)
}

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["kayıtsız"]
};

module.exports.help = {
  name: 'kayıtsız'
};