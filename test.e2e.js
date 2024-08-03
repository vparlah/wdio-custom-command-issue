import { expect, browser } from "@wdio/globals";

browser.addCommand(
  "myCommand",
  () => {
    return 1;
  },
  true
);

describe("Custom command test", () => {
  const existingSel = "#username";
  const nonExistingSel = "#username123";

  beforeEach(async () => {
    await browser.url("https://the-internet.herokuapp.com/login");
    await expect($(existingSel)).toBeExisting();
    await expect($(nonExistingSel)).not.toBeExisting();
  });

  it("default command isDisplayed() should work", async () => {
    const resultExistingSel = await $(existingSel).isDisplayed();
    expect(resultExistingSel).toBe(true);

    const resultNonExistingSel = await $(nonExistingSel).isDisplayed();
    expect(resultNonExistingSel).toBe(false);
  });

  it("custom command myCommand() should work", async () => {
    const resultExistingSel = await $(existingSel).myCommand();
    expect(resultExistingSel).toBe(1);

    // ERROR: Can't call myCommand on element with selector "#username123" because element wasn't found
    const resultNonExistingSel = await $(nonExistingSel).myCommand();
    expect(resultNonExistingSel).toBe(1);
  });
});
