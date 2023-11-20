/**
 * See the LICENSE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 * This file is part of the Cristal Wiki software prototype
 * @copyright  Copyright (c) 2023 XWiki SAS
 * @license    http://opensource.org/licenses/AGPL-3.0 AGPL-3.0
 *
 **/

import type { WikiConfig } from "../api/WikiConfig";
import { inject, injectable } from "inversify";
import type { Storage } from "../api/storage";
import type { CristalApp } from "../api/cristalApp";
import type { WrappingStorage } from "../api/wrappingStorage";
import type { Logger } from "../api/logger";

@injectable()
export class DefaultWikiConfig implements WikiConfig {
  public name: string;
  public baseURL: string;
  public baseRestURL: string;
  public homePage: string;
  public storage: Storage;
  public serverRendering: boolean;
  public designSystem: string;
  public offline: boolean;
  public offlineSetup: boolean;
  public cristal: CristalApp;
  public logger: Logger;

  constructor(@inject<Logger>("Logger") logger: Logger) {
    this.logger = logger;
    this.logger.setModule("storage.components.defaultWikiStorage");
    this.offlineSetup = false;
  }

  setConfig(
    name: string,
    baseURL: string,
    baseRestURL: string,
    homePage: string,
    serverRendering: boolean,
    designSystem: string,
    offline: boolean,
  ): void {
    this.name = name;
    this.baseURL = baseURL;
    this.baseRestURL = baseRestURL;
    this.homePage = homePage;
    this.serverRendering = serverRendering;
    this.designSystem = designSystem;
    this.offline = offline;
  }

  // TODO get rid of any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setConfigFromObject(configObject: any): void {
    this.name = configObject.name;
    this.baseURL = configObject.baseURL;
    this.baseRestURL = configObject.baseRestURL;
    this.homePage = configObject.homePage;
    this.serverRendering = configObject.serverRendering;
    this.offline = configObject.offline;
    this.designSystem = configObject.designSystem;
  }

  setupOfflineStorage() {
    this.logger.debug("Checking offline storage");
    if (this.offline && this.cristal) {
      this.logger.debug("Looking for wrapping offline storage");
      const wrappingOfflineStorage = this.cristal
        .getContainer()
        .get<WrappingStorage>("WrappingStorage");
      if (wrappingOfflineStorage) {
        this.logger.debug("Offline local storage is ready");
        wrappingOfflineStorage.setStorage(this.storage);
        wrappingOfflineStorage.setWikiConfig(this.storage.getWikiConfig());
        this.storage = wrappingOfflineStorage;
      } else {
        this.logger.debug("Failed Looking for wrapping offline storage");
      }
    } else {
      if (!this.cristal) {
        this.logger.debug("Cristal not initialized");
      }
      if (!this.offline) {
        this.logger.debug("Offline mode not activated");
      }
    }
  }

  isSupported(format: string): boolean {
    return format == "html";
  }

  initialize() {
    if (this.offline && !this.offlineSetup) {
      this.setupOfflineStorage();
      this.offlineSetup = true;
      this.storage.isStorageReady();
    }
  }
}
