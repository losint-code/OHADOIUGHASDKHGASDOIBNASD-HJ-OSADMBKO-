const { dc, MessageEmbed } = require('discord.js')
const db = require('quick.db')
const Settings = require('../Settings/Settings.json')
const Other = require('../Settings/Other.json')

exports.run = async (client, message, args) => {
  
if(![(Settings.Roles.Registerer)].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.reply(`Bu Komut İçin Yetkiniz Bulunmamaktadır.`) 

if (message.channel.id !== Settings.Channels.RegisterChat) return message.channel.send(`Burası bir kayıt kanalı değil. Kayıt kanalı: <#${Settings.Channels.RegisterChat}>`)

const emoji = message.guild.emojis.cache.find(r => r.name (Other.EmojiGeneral.Emoji1)) 

let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if (!args[1]) return message.channel.send("Bir isim girmelisin.")
if (!args[2]) return message.channel.send("Bir yaş girmelisin.")
let name = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();
let age = args[2]
if (age < 13) return message.channel.send(`Kayıt ettiğin üyenin yaşı 13'ten küçük olamaz.`)

if (!user) return message.channel.send("Erkek olarak kayıt edeceğin kişiyi etiketlemelisin.")
if (!name) return message.channel.send("Erkek olarak kayıt edeceğin kişinin ismini yazmalısın.")
if (!age) return message.channel.send("Erkek olarak kayıt edeceğin kişinin yaşını yazmalısın.")

if (user.user.tag.includes(Settings.ServerSettings.Tag)) {
    user.setNickname(`${Settings.ServerSettings.Tag} ${name} | ${age}`)
  } else {
    user.setNickname(`${Settings.ServerSettings.UnTag} ${name} | ${age}`)
  }
user.roles.add(Settings.Roles.BoyRole1)
user.roles.add(Settings.Roles.BoyRole2)
user.roles.remove(Settings.Roles.Unregister)

await db.push(`kayıt.öncekibilgiler.${user.id}`, {
    Registerer: message.author.id,
    Name: name,
    Age: age,
    Rol: "Erkek"
  })

await db.push(`kayıt.yetkilibilgiler.${message.author.id}`, {
    Registered: user.id,
    Name: name,
    Age: age,
    Rol: "Erkek",
  })

  db.add(`kayıt.${message.author.id}.toplam`, +1)
  db.add(`kayıt.${message.author.id}.erkek`, +1)
  let toplam = await db.get(`kayıt.${message.author.id}.toplam`)
  let erkek = await db.get(`kayıt.${message.author.id}.erkek`)

  let x = await db.get(`kayıt.öncekibilgiler.${user.id}`)
  let isimler = x.length > 0 ? x.map((value, index) => `\`${index + 1})\` Ad: ${value.Name.replace("_", " ")} | ${value.Age} Yetkili: <@${value.Registerer}> Rolü: **[${value.Rol}]**`).join(`\n`) : "Bu Kullanıcının Önceden Bulunan Bir İsmi Yok.";
  let embed = new MessageEmbed()
    .setAuthor(user.user.tag, user.user.avatarURL({ dynamic: true }))
    .setColor(settings.colors.magentaColor)
    .setDescription(`• ${user} Kişisinin Adı ${name} | ${age} Olarak Değiştirildi.
    • ${user}'a Tanımlı Olan **Erkek** Rollerini Başarıyla Verdim.
    • ${user} Kullanıcısının Önceki İsimleri:
${isimler}
`)
.setFooter(`${message.author.username} Yetkilisinin Toplam \`${toplam}\` Kaydı Oldu.`)
message.channel.send(embed)
message.react(emoji)

const chatembed = new MessageEmbed()
.setDescription(`• ${user} Aramıza Hoşgeldin Dostum Keyifli Vakitler Geçirmeni Dilerim.`)
.setColor(Settings.Colors.Gold)
Settings.Channels.GeneralChat.send(chatembed)

const dmlog = new MessageEmbed()
.setDescription(`• ${user} Tebrikler, \`${message.guild.name}\` Sunucusunda \`Erkek\` Olarak Kaydedildin.
• İsmin \`${Settings.ServerSettings.Tag} ${name} | ${age}\` Olarak Değiştirildi.`)
.setFooter(`Eğer Kaydında Bir Yanlışlık Varsa Yetkililere Bildir Lütfen.`)
.setColor(Settings.Colors.Blue)
user.send(dmlog)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["erkek", "e", "man", "boy"],
    permLevel: 0
};

exports.help = {
    name: "erkek"
}