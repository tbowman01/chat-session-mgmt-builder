# In-Memory Store Design

## Architecture Overview

The in-memory store is designed as a thread-safe, high-performance data structure for managing chat sessions without external dependencies.

## Core Components

### 1. Storage Layer

```
InMemoryChatStore
├── Map<string, Chat>     // Primary storage
├── IdGenerator           // Unique ID generation
├── Mutex/Lock            // Thread safety
└── Validators            // Input validation
```

### 2. Data Structure

**Primary Storage**: JavaScript Map
- O(1) lookup by ID
- Maintains insertion order
- Efficient iteration
- Better performance than plain objects for frequent additions/deletions

**Index Structures** (Future Enhancement):
- Priority index: Map<priority, Set<chatId>>
- Active status index: Map<boolean, Set<chatId>>
- Created date index: B-tree for range queries

### 3. Concurrency Model

**Thread Safety Strategy**:
- Read-Write Lock pattern
- Multiple concurrent reads allowed
- Exclusive write access
- Atomic operations for all mutations

**Lock Granularity**:
- Store-level locking (simple, sufficient for < 10K items)
- Future: Row-level locking for better concurrency

### 4. Memory Management

**Capacity Planning**:
- Average chat session size: ~500 bytes
- 10,000 chat sessions = ~5MB memory
- Overhead for indexes: ~20%
- Total memory footprint: ~6MB for 10K items

**Memory Optimization**:
- Lazy loading of description field
- Compact storage format
- Periodic cleanup of deleted items

## Operations Design

### Create Operation
```
1. Acquire write lock
2. Validate input
3. Generate unique ID
4. Create chat session object
5. Store in map
6. Update indexes
7. Release lock
8. Return created chat session
```

### Read Operations
```
FindAll:
1. Acquire read lock
2. Apply filters
3. Sort if requested
4. Apply pagination
5. Release lock
6. Return results

FindById:
1. Acquire read lock
2. Direct map lookup
3. Release lock
4. Return chat session or null
```

### Update Operation
```
1. Acquire write lock
2. Verify chat session exists
3. Validate updates
4. Apply changes
5. Update timestamp
6. Update indexes if needed
7. Release lock
8. Return updated chat session
```

### Delete Operation
```
1. Acquire write lock
2. Verify chat session exists
3. Remove from map
4. Update indexes
5. Release lock
6. Return success
```

## Error Handling

### Validation Errors
- Title required and length check
- Description length check
- Priority enum validation
- Type checking for all fields

### Concurrency Errors
- Deadlock prevention
- Timeout on lock acquisition
- Graceful degradation under load

### Resource Errors
- Memory limit checking
- Maximum item count enforcement
- Rate limiting per operation

## Performance Characteristics

### Time Complexity
- Create: O(1)
- Read by ID: O(1)
- Read all: O(n)
- Update: O(1)
- Delete: O(1)
- Filter/Search: O(n) - can be optimized with indexes

### Space Complexity
- Storage: O(n) where n = number of todos
- Indexes: O(n) additional space
- Total: O(2n) ≈ O(n)

## Scaling Considerations

### Horizontal Scaling
- Partitioning by user ID
- Consistent hashing for distribution
- Read replicas for query scaling

### Vertical Scaling
- Increase memory allocation
- Optimize data structures
- Implement compression

### Future Enhancements
1. **Persistence Layer**: Optional disk backup
2. **Caching Layer**: LRU cache for frequent queries
3. **Search Engine**: Full-text search capability
4. **Event Sourcing**: Audit log of all changes
5. **Metrics Collection**: Performance monitoring

## Implementation Classes

### Core Store Class
```javascript
class InMemoryTodoStore {
  constructor(options = {}) {
    this.todos = new Map()
    this.idCounter = 0
    this.maxItems = options.maxItems || 10000
    this.lock = new ReadWriteLock()
  }
}
```

### Supporting Classes
```javascript
class TodoValidator {
  static validate(todo) { /* ... */ }
}

class IdGenerator {
  static generate() { /* ... */ }
}

class ReadWriteLock {
  acquireRead() { /* ... */ }
  acquireWrite() { /* ... */ }
  release() { /* ... */ }
}
```

## Testing Strategy

### Unit Tests
- CRUD operations
- Validation logic
- Concurrency scenarios
- Edge cases

### Integration Tests
- API endpoint testing
- Error handling
- Performance benchmarks

### Load Tests
- Concurrent operations
- Memory usage
- Response times under load

## Security Considerations

1. **Input Sanitization**: Prevent injection attacks
2. **Rate Limiting**: Prevent DoS
3. **Memory Limits**: Prevent memory exhaustion
4. **Access Control**: Future multi-tenant support
5. **Audit Logging**: Track all modifications