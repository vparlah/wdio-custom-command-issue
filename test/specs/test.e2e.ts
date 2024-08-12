import { expect, browser, $, $$ } from "@wdio/globals";
import { MobileDriver } from "./lib.js";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    const mobileDriver = new MobileDriver(browser);

    await mobileDriver.url(`https://the-internet.herokuapp.com/login`);

    try {
      await mobileDriver
        .mobile$("#content")
        .mobile$("#login")
        .mobile$(`#username`)
        .setValue("tomsmith");
    } catch (e) {
      await mobileDriver
        .mobile$("#content")
        .mobile$("#login")
        .mobile$(`#username`)
        .setValue("tomsmith");
    }

    await mobileDriver.mobile$(`#password`).setValue("SuperSecretPassword!");
    await mobileDriver.mobile$('button[type="submit"]').click();

    await browser.$("#username").setValue("tomsmith");
    // await browser.$("#password").setValue("SuperSecretPassword!");
    await browser.$$('button[type="submit"]').every(async (el) => {
      await el.click();
    });

    await expect(mobileDriver.mobile$(`#flash`).asWdioElement()).toBeExisting();
    await expect(mobileDriver.mobile$(`#flash`).asWdioElement()).toHaveText(
      expect.stringContaining("You logged into a secure area!")
    );

    const username = mobileDriver
      .mobile$("#content")
      .mobile$("#login")
      .mobile$(`#username`);

    try {
      await username.setValue("tomsmith");
    } catch (e) {
      await username.setValue("tomsmith");
    }
  });
});
