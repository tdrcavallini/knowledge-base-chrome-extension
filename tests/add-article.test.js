import { insertArticle } from '../src/add-article';

let mockArticles = [];
let mockError = null;


jest.mock('@supabase/supabase-js', () => ({
    createClient: () => createMockClient(mockArticles, mockError)
}));

const createMockClient = (mockData, error) => {
    return {
        from: jest.fn(() => ({
          insert: jest.fn(() => ({
            select: jest.fn(() => {
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
    };
}

describe('insertArticle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should insert an article with title, description, and code', async () => {
    // Arrange
    mockArticles = { id: 1, title: 'Test Article 1', description: 'This is a test article', code: 'This is some test code', created_at: '2022-01-01T00:00:00.000Z', };
    mockError = null;
    const title = 'Test Article 1';
    const description = 'This is a test article';
    const code = 'This is some test code';
    const expected = { 
        data: { id: 1, title: 'Test Article 1', description: 'This is a test article', code: 'This is some test code', created_at: '2022-01-01T00:00:00.000Z', }, 
        error: undefined 
    }

    // Act.    
    const result = await insertArticle(title, description, code);

    // Assert
    expect(result).toEqual(expected);
  });

  it('should return an error if insert fails', async () => {
    // Arrange
    mockArticles = [];
    mockError =  {"code":"42601","details":null,"hint":null,"message":"syntax error in tsquery: \"%bad !> ? %\""}

    const title = 'Test Article 1';
    const description = 'This is a test article';
    const code = 'This is some test code';
    const expected = { 
        data: [], 
        error: {"code":"42601","details":null,"hint":null,"message":"syntax error in tsquery: \"%bad !> ? %\""} 
    }

    // Act.    
    const result = await insertArticle(title, description, code);

    // Assert
    expect(result).toEqual(expected);
  });

});