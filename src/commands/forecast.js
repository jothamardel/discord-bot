const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { fetchForeCast } = require("../request/forecast");

const data = new SlashCommandBuilder();
const embed = new EmbedBuilder()
  .setColor("#3f704d")
  .setDescription("Weather forecast");
data
  .setName("forecast")
  .setDescription("Get the weather forecast for a location")
  .addStringOption((option) => {
    return option
      .setName("location")
      .setDescription(
        "The location can be a city, zip/postal code, or a latitude and longitude or a country."
      )
      .setRequired(true);
  })
  .addStringOption((option) => {
    return option
      .setName("units")
      .setDescription(
        "The unit system of the results: either  metric or  imperial."
      )
      .setRequired(false)
      .addChoices(
        {
          name: "Metric",
          value: "metric",
        },
        {
          name: "Imperial",
          value: "imperial",
        }
      );
  });

async function execute(interaction) {
  await interaction.deferReply();
  const location = interaction.options.getString("location");
  const units = interaction.options.getString("units") || "metric";
  const isMetric = units === "metric";
  try {
    const { locationName, weatherData, country, city } = await fetchForeCast({
      location,
      units,
    });
    embed
      .setTitle(`Weather forecast for ${locationName}...`)
      .setDescription(`Using the ${units} system.`)
      .setTimestamp()
      .setFooter({
        text: "Weather Bot API",
        iconURL: "https://i.imgur.com/5OJYj8C.png",
      });

    for (const day of weatherData) {
      const temperatureMin = isMetric ? day.minTempC : day.minTempF;
      const temperatureMax = isMetric ? day.maxTempC : day.maxTempF;
      embed.addFields({
        name: `📅 ${day.date}`,
        value: `⬇️ Min: ${temperatureMin}${
          isMetric ? "°" : "F"
        }, ⬆️ Max: ${temperatureMax}${isMetric ? "°" : "F"}, ${day.condition}`,
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
