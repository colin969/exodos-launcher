import { MessageBoxOptions, OpenExternalOptions } from "electron";
import { EventEmitter } from "events";
import { Server } from "http";
import * as WebSocket from "ws";
import { BackInit, ViewGame, WrappedRequest } from "@shared/back/types";
import { IAppConfigData } from "@shared/config/interfaces";
import { IGameInfo } from "@shared/game/interfaces";
import {
    ExecMapping,
    GamePlaylist,
} from "@shared/interfaces";
import { LangContainer, LangFile } from "@shared/lang";
import { ILogEntry, ILogPreEntry } from "@shared/Log/interface";
import { GameOrderBy, GameOrderReverse } from "@shared/order/interfaces";
import { IAppPreferencesData } from "@shared/preferences/interfaces";
import { Theme } from "@shared/ThemeFile";
import { GameManagerState } from "./game/types";
import { EventQueue } from "./util/EventQueue";

export type BackState = {
    isInit: boolean;
    isExit: boolean;
    server: WebSocket.Server;
    fileServer: Server;
    fileServerPort: number;
    secret: string;
    preferences: IAppPreferencesData;
    config: IAppConfigData;
    configFolder: string;
    exePath: string;
    localeCode: string;
    gameManager: GameManagerState;
    messageQueue: WebSocket.MessageEvent[];
    isHandling: boolean;
    messageEmitter: MessageEmitter;
    init: { [key in BackInit]: boolean };
    initEmitter: InitEmitter;
    queries: Record<string, BackQueryChache>;
    log: ILogEntry[];
    languageQueue: EventQueue;
    languages: LangFile[];
    languageContainer: LangContainer;
    themeFiles: ThemeListItem[];
    playlistQueue: EventQueue;
    playlists: GamePlaylist[];
    execMappings: ExecMapping[];
    installedGames: string[];
};

export type BackQueryChache = {
    query: BackQuery;
    games: IGameInfo[];
    viewGames: ViewGame[];
};

export type BackQuery = {
    extreme: boolean;
    broken: boolean;
    library: string;
    search: string;
    orderBy: GameOrderBy;
    orderReverse: GameOrderReverse;
    playlistId?: string;
};

type MessageEmitter = EmitterPart<string, (request: WrappedRequest) => void> &
    EventEmitter;

type InitEmitter = EmitterPart<BackInit, () => void> & EventEmitter;

interface EmitterPart<
    E extends string | number | Symbol,
    F extends (...args: any[]) => void
> {
    on(event: E, listener: F): this;
    once(event: E, listener: F): this;
    off(event: E, listener: F): this;
    emit(event: E, ...args: Parameters<F>): boolean;
}

export type ThemeListItem = Theme & {
    /**
     * File or folder name of the theme (relative to the theme folder).
     * Format: X in "\X" or "\X\theme.css"
     */
    basename: string;
};

export type LogFunc = (entry: ILogPreEntry) => void;
export type OpenDialogFunc = (options: MessageBoxOptions) => Promise<number>;
export type OpenExternalFunc = (
    url: string,
    options?: OpenExternalOptions
) => Promise<void>;
