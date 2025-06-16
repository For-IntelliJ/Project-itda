import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public class GenericService<T> {

    protected final JpaRepository<T, Long> repository;

    public GenericService(JpaRepository<T, Long> repository) {
        this.repository = repository;
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public Optional<T> findOptionalById(Long id) {
        return repository.findById(id);
    }

    public T findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 엔티티를 찾을 수 없습니다. id=" + id));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
