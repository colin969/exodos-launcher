import * as fs from 'fs';
import * as path from 'path';

interface ICache {
  [key: string]: string|undefined;
}

export class ThumbnailFolderCache {
  /** Key-Value pair of titles and filenames */
  private _cache: ICache = {};
  /** Names of all files in the folder, separated by a newline */
  private _filenames: string = '';
  /** Path to the folder to cache the filenames from */
  private _folderPath: string = '';

  public loadFilenames(folderPath: string): void {
    // Clean up the path
    this._folderPath = path.posix.normalize(folderPath).replace(/\\/g, '/');
    // Get the names of all files in the folder
    fs.readdir(this._folderPath, (error, files) => {
      if (error) { throw error; }
      this._filenames = files.join('\n');
    });
  }
  
  /**
   * Get the path to the thumbnail for a given title (returns undefined if not found)
   * @param title Title of game
   * @returns Path to thumbnail for that game, or undefined if not found
   */
  public getFilePath(title: string): string|undefined {
    // Try getting the filename from the "cache"
    const filename = this._cache[title];
    if (filename) { return path.posix.join(this._folderPath, filename); }
    // Try getting the filename from the filename list
    const regex = ThumbnailFolderCache.createRegex(title);
    const filenames = this._filenames.match(regex);
    if (filenames) { // Thumbnail found
      // @TODO If there are multiple filenames found, maybe we should figure
      //       out which is most suitable (lowest index, shortest name, etc.)
      this._cache[title] = filenames[0];
      return path.posix.join(this._folderPath, filenames[0]);
    }
    // No thumbnail found
    console.error(`Thumbnail was not found for game: ${title} ` +
                  `(FolderPath: ${this._folderPath}, Regex: ${regex})`);
  }

  /** Create a regex that will find the filename for a title */
  private static createRegex(title: string) {
    let cleanTitle: string = replaceInvalidFilesystemChars(title);
    cleanTitle = escapeRegExp(cleanTitle);
    cleanTitle = cleanTitle.replace(/ /g, ' +'); // (Allow any number of spaces)
    return new RegExp(`^${cleanTitle} *(?:\\..+)?-[0-9]{2}\\..+$`, 'm');
  }
}

/** Escape all special regex characters from a string */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/** Replace all invalid filesystem characters with underscores */
function replaceInvalidFilesystemChars(title: string): string {
  return title.replace(/[/\\?*:|"<>']/g, '_');
}