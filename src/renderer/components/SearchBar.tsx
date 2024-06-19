import { setAdvancedFilter, setOrderBy, setOrderReverse, setSearchText } from "@renderer/redux/searchSlice";
import store, { RootState } from "@renderer/redux/store";
import { GameOrderBy, GameOrderReverse } from "@shared/order/interfaces";
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { GameOrder } from "./GameOrder";
import { OpenIcon } from "./OpenIcon";
import { SimpleButton } from "./SimpleButton";
import { ArrowKeyStepper, AutoSizer, List, ListRowProps } from "react-virtualized";

export type SearchBarProps = {
  view: string;
};

export function SearchBar(props: SearchBarProps) {
  const { searchState, gamesState } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(true);
  const [advancedMode, setAdvancedMode] = React.useState(false);
  const view = searchState.views[props.view];

  const seriesItems = React.useMemo(() => {
    const set = new Set(view.games.flatMap(g => g.series.split(';').map(s => s.trim())));
    return Array.from(set).sort();
  }, [view.games]);

  const developerItems = React.useMemo(() => {
    const set = new Set(view.games.flatMap(g => g.developer.split(';').map(s => s.trim())));
    return Array.from(set).sort();
  }, [view.games]);

  const publisherItems = React.useMemo(() => {
    const set = new Set(view.games.flatMap(g => g.publisher.split(';').map(s => s.trim())));
    return Array.from(set).sort();
  }, [view.games]);

  const genreItems = React.useMemo(() => {
    const set = new Set(view.games.flatMap(g => g.genre.split(';').map(s => s.trim())));
    return Array.from(set).sort();
  }, [view.games]);

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText({
      view: props.view,
      text: event.target.value
    }));
  }

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const onKeypress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "KeyF") {
          const element = searchInputRef.current;
          if (element) {
              element.select();
              event.preventDefault();
          }
      }
  };

  const onChangeOrderBy = (value: GameOrderBy) => {
    dispatch(setOrderBy({
      view: props.view,
      value,
    }))
  };

  const onChangeOrderReverse = (value: GameOrderReverse) => {
    dispatch(setOrderReverse({
      view: props.view,
      value,
    }))
  };

  React.useEffect(() => {
      window.addEventListener('keypress', onKeypress);

      return () => {
          window.removeEventListener('keypress', onKeypress);
      };
  }, []);

  const onInstalledChange = (value?: boolean) => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        installed: value,
      }
    }));
  }

  const onRecommendedChange = (value?: boolean) => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        recommended: value,
      }
    }));
  }

  const onToggleDeveloper = (developer: string) => {
    const newDeveloper = [...view.advancedFilter.developer];
    const idx = newDeveloper.findIndex(s => s === developer);
    if (idx > -1) {
      newDeveloper.splice(idx, 1);
    } else {
      newDeveloper.push(developer);
    }

    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        developer: newDeveloper,
      }
    }));
  }

  const onClearDeveloper = () => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        developer: [],
      }
    }));
  }

  const onTogglePublisher = (publisher: string) => {
    const newPublisher = [...view.advancedFilter.publisher];
    const idx = newPublisher.findIndex(s => s === publisher);
    if (idx > -1) {
      newPublisher.splice(idx, 1);
    } else {
      newPublisher.push(publisher);
    }

    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        publisher: newPublisher,
      }
    }));
  }

  const onClearPublisher = () => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        publisher: [],
      }
    }));
  }

  const onToggleSeries = (series: string) => {
    const newSeries = [...view.advancedFilter.series];
    const idx = newSeries.findIndex(s => s === series);
    if (idx > -1) {
      newSeries.splice(idx, 1);
    } else {
      newSeries.push(series);
    }

    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        series: newSeries,
      }
    }));
  }

  const onClearSeries = () => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        series: [],
      }
    }));
  }

  const onToggleGenre = (genre: string) => {
    const newGenre = [...view.advancedFilter.genre];
    const idx = newGenre.findIndex(s => s === genre);
    if (idx > -1) {
      newGenre.splice(idx, 1);
    } else {
      newGenre.push(genre);
    }

    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        genre: newGenre,
      }
    }));
  }

  const onClearGenre = () => {
    dispatch(setAdvancedFilter({
      view: props.view,
      filter: {
        ...view.advancedFilter,
        genre: [],
      }
    }));
  }

  return (
    <div className={`search-bar-wrapper ${expanded ?
      advancedMode ? 'search-bar-wrapper--expanded-advanced' : 'search-bar-wrapper--expanded-simple'
      : ''}`}>
      <div className="search-bar">
        <div className="search-bar-icon">
          <OpenIcon icon='magnifying-glass'/>
        </div>
        <input
          ref={searchInputRef}
          className="search-bar-text-input"
          value={view.text}
          onChange={onTextChange} />
        <GameOrder
          orderBy={view.orderBy}
          orderReverse={view.orderReverse}
          onChangeOrderBy={onChangeOrderBy}
          onChangeOrderReverse={onChangeOrderReverse}/>
        <SimpleButton 
          value={expanded ? "Hide Filters" : "Show Filters"}
          onClick={() => setExpanded(!expanded)}/>
      </div>
      { expanded && 
        (advancedMode ? (
          <div className='search-bar-expansion search-bar-expansion-advanced'>
            test
          </div>
        ) : (
          <div className='search-bar-expansion search-bar-expansion-simple'>
            <ThreeStateCheckbox
              title="Installed"
              value={view.advancedFilter.installed}
              onChange={onInstalledChange}/>
            <ThreeStateCheckbox
              title="Recommended"
              value={view.advancedFilter.recommended}
              onChange={onRecommendedChange}/>
            <SearchableSelect 
              title='Developer'
              onToggle={onToggleDeveloper}
              onClear={onClearDeveloper}
              selected={view.advancedFilter.developer}
              items={developerItems}/>
            <SearchableSelect 
              title='Publisher'
              onToggle={onTogglePublisher}
              onClear={onClearPublisher}
              selected={view.advancedFilter.publisher}
              items={publisherItems}/>
            <SearchableSelect 
              title='Series'
              onToggle={onToggleSeries}
              onClear={onClearSeries}
              selected={view.advancedFilter.series}
              items={seriesItems}/>
            <SearchableSelect 
              title='Genre'
              onToggle={onToggleGenre}
              onClear={onClearGenre}
              selected={view.advancedFilter.genre}
              items={genreItems}/>
          </div>
        ))
      }
    </div>
  );
}

type ThreeStateCheckboxProps = {
  value?: boolean;
  title: string;
  onChange: (value?: boolean) => void;
}

function ThreeStateCheckbox(props: ThreeStateCheckboxProps) {
  const { value, onChange, title } = props;
  
  const handleClick = () => {
    if (value === true) {
      onChange(false);
    } else if (value === false) {
      onChange(undefined);
    } else {
      onChange(true);
    }
  };

  // Cycles on left click, clears on right click
  return (
    <div className='search-bar-simple-box' onClick={handleClick}>
      <b>{title}</b>
      <div className='three-state-checkbox' onContextMenu={() => onChange(undefined)}>
        {value === true && <OpenIcon icon='check'/>}
        {value === false && <OpenIcon icon='x'/>}
        {value === undefined && <div></div>}
      </div>
    </div>
  );
}

type SearchableSelectProps = {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onClear: () => void;
}

function SearchableSelect(props: SearchableSelectProps) {
  const { title, items, selected, onToggle, onClear } = props;
  const [expanded, setExpanded] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const onToggleExpanded = () => {
    setExpanded(!expanded);
  }

  // Close dropdown when clicking outside of it
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpanded(false);
    }
  };

  React.useEffect(() => {
    // Add event listener to handle clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener on component unmount
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className='search-bar-simple-box'
      onClick={onToggleExpanded}
      onContextMenu={onClear}>
      <div
        className="searchable-select"
        ref={dropdownRef}>
        <div className="searchable-select-header">
          <div className="searchable-select-title">{title}</div>
          { selected.length > 0 && (
            <div className="searchable-select-number">{selected.length}</div>
          )}
          <div className="searchable-select-chevron">
            { expanded ? (
              <OpenIcon icon='chevron-top'/>
            ) : (
              <OpenIcon icon='chevron-bottom'/>
            )}
          </div>
        </div>
        {expanded && (
          <SearchableSelectDropdown
            items={items}
            onToggle={onToggle}
            selected={selected}
            />
        )}
      </div>
    </div>
  );
}

type SearchableSelectDropdownProps = {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

function SearchableSelectDropdown(props: SearchableSelectDropdownProps) {
  const { items, selected, onToggle } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [search, setSearch] = React.useState('');
  const [storedItems, _setStoredItems] = React.useState(items); // 'cache' the items

  const filteredItems = React.useMemo(() => {
    const lowerSearch = search.toLowerCase().replace(' ', '');
    return storedItems.filter((item) => item && item.toLowerCase().replace(' ', '').includes(lowerSearch));
  }, [search, storedItems]);
  console.log(filteredItems);

  const rowRenderer = (props: ListRowProps) => {
    const { style } = props;
    const item = filteredItems[props.index];

    if (!item) {
      return (
        <div style={style} key={props.index}>{props.index}</div>
      );
    }

    const marked = selected.includes(item);
          
    return (
      <div
        style={style}
        className={`searchable-select-dropdown-item ${marked && 'searchable-select-dropdown-item--selected'}`}
        onClick={() => onToggle(item)}
        key={item}>
        <div className="searchable-select-dropdown-item-title">
          {item}
        </div>
        { marked && (
          <div className="searchable-select-dropdown-item-marked">
            <OpenIcon icon='check'/>
          </div>
        )}
      </div>
    )
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); 

  return (
    <div 
      onClick={(event) => {
        // Prevent bubble up
        event.stopPropagation();
        event.preventDefault();
        return -1;
      }}
      className="searchable-select-dropdown">
      <input 
        ref={inputRef}
        className="searchable-select-dropdown-search-bar"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}/>
      <div className="searchable-select-dropdown-results">
        <AutoSizer>
          {({ width, height }) => {
            return (
              <ArrowKeyStepper
                mode="cells"
                isControlled={true}
                columnCount={1}
                rowCount={filteredItems.length}
                >
                  {({
                    onSectionRendered
                  }) => (
                    <List
                      className="simple-scroll"
                      width={width}
                      height={height}
                      overscanRowCount={20}
                      rowCount={filteredItems.length}
                      rowHeight={30}
                      rowRenderer={rowRenderer}
                      onSectionRendered={onSectionRendered}
                      />
                  )}
              </ArrowKeyStepper>
            )
          }}
        </AutoSizer>
      </div>
    </div>
  );
}