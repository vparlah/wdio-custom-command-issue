import type {
  ChainablePromiseElement,
  ChainablePromiseArray,
} from "webdriverio";

export class Selector {
  public static accessibilityId(sel: string): string {
    return `~${sel}`;
  }

  public static raw(sel: string): string {
    return sel;
  }
}

export class MobileDriver {
  constructor(public readonly wdioDriver: WebdriverIO.Browser) {}

  public async url(url: string): Promise<void> {
    await this.wdioDriver.url(url);
  }

  public mobile$(selector: string): MobileElement {
    return new MobileElement(this, selector, false);
  }

  public mobile$$(selector: string): MobileElement {
    return new MobileElement(this, selector, true);
  }
}

export class MobileElement {
  constructor(
    public readonly parent: MobileDriver | MobileElement,
    public readonly selector: string,
    public readonly elementArray: boolean
  ) {}

  public mobile$(selector: string): MobileElement {
    return new MobileElement(this, selector, false);
  }

  public mobile$$(selector: string): MobileElement {
    return new MobileElement(this, selector, true);
  }

  private async chainableElement(
    allChainIsPresent = true,
    listOfElements: Array<MobileElement> = []
  ): Promise<ChainablePromiseElement<WebdriverIO.Element>> {
    if (this.parent instanceof MobileDriver) {
      if (listOfElements.length === 0) {
        return this.parent.wdioDriver.$(this.selector);
      }

      const selectors: Array<string> = [];
      selectors.push(this.selector);

      listOfElements.reverse();

      selectors.push(...listOfElements.map((el) => el.selector));

      console.log("selectors", selectors);

      let chain = this.parent.wdioDriver.$(this.selector);

      await MobileElement.elementShouldPresent(
        this.parent.wdioDriver,
        this.selector,
        selectors
      );

      for (let i = 0; i < listOfElements.length; i++) {
        const element = listOfElements[i];
        await MobileElement.elementShouldPresent(
          this.parent.wdioDriver,
          element.selector,
          selectors
        );

        chain = chain.$(element.selector);
      }
      return chain;
    }

    listOfElements.push(this);
    return this.parent.chainableElement(allChainIsPresent, listOfElements);
  }

  public async setValue(value: string): Promise<void> {
    await (await this.chainableElement()).setValue(value);
  }

  public async click(): Promise<void> {
    await (await this.chainableElement()).click();
  }

  public async asWdioElement(): Promise<
    ChainablePromiseElement<WebdriverIO.Element>
  > {
    return this.chainableElement();
  }

  private static async elementShouldPresent(
    wdioDriver: WebdriverIO.Browser,
    selector: string,
    selectors: Array<string>
  ): Promise<void> {
    try {
      await wdioDriver.$(selector).waitForExist({ timeout: 5000 });
    } catch (e) {
      throw new Error(
        `Element with selector ${selector} from selectors chain ${selectors.toString()} is not present`
      );
    }
  }
}
