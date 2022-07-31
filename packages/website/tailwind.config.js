module.exports = {
  content: ["./pages/**/*.tsx", "./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: ({ theme }) => ({
        hard: `${theme("spacing.2")} ${theme("spacing.2")} 0 0 ${theme(
          "colors.gray.300"
        )}`,
      }),
    },
  },
  plugins: [],
};
