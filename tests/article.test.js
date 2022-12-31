import { searchArticles, displayEmptyMessage, handleSearchArticles } from '../src/app';

let mockArticles = [];
let mockError = null;

const expectedArticles = [
  { id: 1, title: 'Test Article 1', description: 'This is a test article', code: 'This is some test code', created_at: '2022-01-01T00:00:00.000Z', },
  { id: 2, title: 'Test Article 2', description: 'This is another test article', code: 'This is some more test code', created_at: '2022-01-02T00:00:00.000Z', },
];

const createMockClient = (mockData, error) => {
    return {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            textSearch: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => {
                    if (error) {
                      return {
                        data: mockData,
                        error
                      }
                    } else {
                      return {
                        data: mockData
                      }
                    }
                  })
              }))
            }))
          }))
        }))
    };
}

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => createMockClient(mockArticles, mockError)
}));

describe('searchArticles', () => {
    beforeEach(() => {
        jest.resetModules();
    });

  it('should return an array of articles matching the given query', async () => {
    // Arrange
    mockArticles = [
        { id: 1, title: 'Test Article 1', description: 'This is a test article', code: 'This is some test code', created_at: '2022-01-01T00:00:00.000Z', },
        { id: 2, title: 'Test Article 2', description: 'This is another test article', code: 'This is some more test code', created_at: '2022-01-02T00:00:00.000Z', },
    ];
    mockError = null;
    const query = 'data-mock-test';
    
    // Act.
    const result = await searchArticles(query);

    // Assert
    expect(result).toEqual({ data: expectedArticles });
  });

  it('should return an empty array when no articles match the given query', async () => {
    // Arrange
    mockArticles = [];
    mockError = null;
    const query = 'data-mock-test';
    
    // Act.
    const result = await searchArticles(query);

    // Assert
    expect(result).toEqual({ data: [] });
  });

  it('should return an error when the query fails', async () => {
    // Arrange
    mockArticles = [];
    mockError =  {"code":"42601","details":null,"hint":null,"message":"syntax error in tsquery: \"%bad !> ? %\""}
    const query = 'invalid-query';
    
    // Act.
    const result = await searchArticles(query);

    // Assert
    expect(result).toEqual({ data: [], error: mockError });
});

it('should display a message when no articles are found', () => {
  // Arrange
  const mockElement = { innerHTML: '' };
  const mockGetElementById = jest.fn(() => mockElement);
  global.document.getElementById = mockGetElementById;
  const message = 'No articles were found matching the search criteria.';

  // Act.
  displayEmptyMessage(message);

  // Assert
  expect(mockGetElementById).toHaveBeenCalledWith('search-results');
  expect(mockElement.innerHTML).toEqual(`<div class="w-full bg-white rounded-lg shadow-md mb-4 p-4 text-center"><h2 class="text-lg font-bold text-gray-900">${message}</h2><p class="text-gray-600 text-sm mb-4">Please try again with a different search term.</p></div>`);
});


it('should display a message if no articles are found', async () => {
  // Arrange
  mockArticles = [];
  mockError = null;
  const mockElement = { innerHTML: '' };
  const mockGetElementById = jest.fn(() => mockElement);
  global.document.getElementById = mockGetElementById;
  const message = 'No articles were found matching the search criteria.';


  // Act.
  await handleSearchArticles();

  // Assert
  expect(mockGetElementById).toHaveBeenCalledWith('search-bar');
  expect(mockGetElementById).toHaveBeenCalledWith('search-results');
  expect(mockElement.innerHTML).toEqual(`<div class="w-full bg-white rounded-lg shadow-md mb-4 p-4 text-center"><h2 class="text-lg font-bold text-gray-900">${message}</h2><p class="text-gray-600 text-sm mb-4">Please try again with a different search term.</p></div>`);
});


it('should display an error message if an error occurred while searching for articles', async () => {
  // Arrange
  mockArticles = [];
  mockError =  {"code":"42601","details":null,"hint":null,"message":"syntax error in tsquery: \"%bad !> ? %\""}
  const mockElement = { innerHTML: '' };
  const mockGetElementById = jest.fn(() => mockElement);
  global.document.getElementById = mockGetElementById;
  const message = 'An error occurred while searching for articles.';


  // Act.
  await handleSearchArticles();

  // Assert
  expect(mockGetElementById).toHaveBeenCalledWith('search-bar');
  expect(mockGetElementById).toHaveBeenCalledWith('search-results');
  expect(mockElement.innerHTML).toEqual(`<div class="w-full bg-white rounded-lg shadow-md mb-4 p-4 text-center"><h2 class="text-lg font-bold text-gray-900">${message}</h2><p class="text-gray-600 text-sm mb-4">Please try again with a different search term.</p></div>`);
});

});

