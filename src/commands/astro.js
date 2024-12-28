const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { fetchForeCast } = require("../request/forecast");

const data = new SlashCommandBuilder();
const embed = new EmbedBuilder()
  .setColor("#3f704d")
  .setDescription("Weather forecast");
data
  .setName("astro")
  .setDescription("The astronomical information for the day.")
  .addStringOption((option) => {
    return option
      .setName("location")
      .setDescription(
        "The location can be a city, zip/postal code, or a latitude and longitude or a country."
      )
      .setRequired(true);
  });

async function execute(interaction) {
  await interaction.deferReply();
  const location = interaction.options.getString("location");

  try {
    const { locationName, weatherData, country, city } = await fetchForeCast({
      location,
    });
    embed
      .setTitle(`Astronomical forecast for ${locationName}...`)
      .setTimestamp()
      .setFooter({
        text: "Weather Bot API",
        iconURL: "https://i.imgur.com/5OJYj8C.png",
      });

    for (const day of weatherData) {
      embed.addFields({
        name: `📅 ${day.date}`,
        value: `🌅 sunrise: ${day.sunriseTime}\n🌅 sunset: ${day.sunsetTime}\n🌔 moonrise: ${day.moonriseTime}\n🌕 moonset: ${day.moonsetTime}`,
      });
      embed.addFields({
        name: " ",
        value: " ",
      });
    }
    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply(embed);
    // await interaction.reply({
    //   content: "There was an error while executing this command!",
    //   ephemeral: true,
    // });
  }
}

module.exports = { data, execute };
