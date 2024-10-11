/*
 * See the LICENSE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

import { defineConfig, mergeConfig } from "vitest/config";
import defaultConfig from "@xwiki/cristal-dev-config/vitest-vue.config";
import localConfig from "./vite.config";

export default mergeConfig(
  mergeConfig(defaultConfig, localConfig),
  defineConfig({
    test: {
      server: {
        deps: {
          // see https://github.com/vitest-dev/vitest/discussions/2677#discussioncomment-7035566
          inline: ["vuetify"],
        },
      },
    },
  }),
);